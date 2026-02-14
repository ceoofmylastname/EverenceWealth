import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { decrypt } from '@/app/admin/(dashboard)/settings/utils'

async function getOpenAIKey(supabase: any): Promise<string | null> {
    if (process.env.OPENAI_API_KEY) {
        return process.env.OPENAI_API_KEY
    }

    const { data } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_key', 'openai_api_key')
        .single()

    if (data?.setting_value) {
        return decrypt(data.setting_value)
    }

    return null
}

export async function POST(request: Request) {
    try {
        const { topic, primary_keyword, target_audience } = await request.json()

        if (!topic || !primary_keyword || !target_audience) {
            return NextResponse.json(
                { error: 'Missing required fields: topic, primary_keyword, target_audience' },
                { status: 400 }
            )
        }

        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const openaiKey = await getOpenAIKey(supabase)
        if (!openaiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured. Add it in Settings or set OPENAI_API_KEY env var.' },
                { status: 500 }
            )
        }

        // Generate article structure with OpenAI
        const structurePrompt = `You are a fiduciary wealth strategist for Everence Wealth, a San Francisco-based independent financial firm.

Topic: ${topic}
Keyword: ${primary_keyword}
Audience: ${target_audience}

Generate 6 articles following a content funnel (3 TOFU awareness, 2 MOFU consideration, 1 BOFU decision).

BRAND FRAMEWORKS (use at least ONE per article):
- The Three Tax Buckets (Taxable / Tax-Deferred / Tax-Exempt)
- The Three Silent Killers (Fees, Volatility, Taxes)
- Zero is Your Hero (0% tax strategy)
- Cash Flow > Net Worth
- Human Life Value
- Living Benefits

For each article provide:
- funnelStage: "tofu" | "mofu" | "bofu"
- headline: Clear, benefit-driven title
- targetKeyword: Primary SEO keyword for this article
- searchIntent: What question the reader is trying to answer
- contentAngle: The fiduciary perspective or framework to use

JSON format:
{
  "articles": [
    {
      "funnelStage": "tofu",
      "headline": "...",
      "targetKeyword": "...",
      "searchIntent": "...",
      "contentAngle": "..."
    }
  ]
}`

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: structurePrompt }],
                response_format: { type: 'json_object' },
            }),
        })

        if (!openaiResponse.ok) {
            const errText = await openaiResponse.text()
            throw new Error(`OpenAI API failed: ${openaiResponse.status} - ${errText}`)
        }

        const openaiData = await openaiResponse.json()
        const structure = JSON.parse(openaiData.choices[0].message.content)

        if (!structure.articles || structure.articles.length === 0) {
            throw new Error('OpenAI returned no articles')
        }

        // Create cluster
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

        const { data: cluster, error: clusterError } = await supabase
            .from('clusters')
            .insert({
                name: topic.length > 60 ? topic.substring(0, 60) + '...' : topic,
                slug,
                topic,
                keywords: primary_keyword,
                target_audience,
                status: 'generating',
                required_content_count: 12,
            })
            .select()
            .single()

        if (clusterError || !cluster) {
            throw new Error('Failed to create cluster: ' + (clusterError?.message || 'Unknown error'))
        }

        // Create generation job
        const { data: job, error: jobError } = await supabase
            .from('cluster_generations')
            .insert({
                cluster_id: cluster.id,
                topic,
                primary_keyword,
                target_audience,
                status: 'processing',
                total_articles: 6,
                user_id: user.id,
            })
            .select()
            .single()

        if (jobError || !job) {
            throw new Error('Failed to create generation job: ' + (jobError?.message || 'Unknown error'))
        }

        // Create blog post records
        const posts = structure.articles.map((article: any, index: number) => ({
            cluster_id: cluster.id,
            title: article.headline,
            slug: article.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now() + '-' + index,
            funnel_stage: article.funnelStage,
            funnel_position: index + 1,
            keywords: article.targetKeyword,
            status: 'generating',
            language: 'en',
        }))

        const { data: createdPosts, error: postsError } = await supabase
            .from('blog_posts')
            .insert(posts)
            .select()

        if (postsError || !createdPosts) {
            throw new Error('Failed to create posts: ' + (postsError?.message || 'Unknown error'))
        }

        // Fire-and-forget: invoke chunk handler for each post
        const baseUrl = new URL(request.url)
        const chunkUrl = `${baseUrl.origin}/api/clusters/generate-chunk`

        for (let i = 0; i < createdPosts.length; i++) {
            fetch(chunkUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: job.id,
                    cluster_id: cluster.id,
                    post_id: createdPosts[i].id,
                    openai_key: openaiKey,
                    article: structure.articles[i],
                    target_audience,
                    topic,
                }),
            }).catch((err) => {
                console.error(`Failed to invoke chunk for post ${createdPosts[i].id}:`, err)
            })
        }

        return NextResponse.json({
            generation_id: job.id,
            cluster_id: cluster.id,
        })
    } catch (error: any) {
        console.error('Generate cluster error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
