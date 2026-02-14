import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use service role client — this route is called internally by the orchestrator,
// not directly by the browser, so cookie-based auth is not available.
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function POST(request: Request) {
    try {
        const { job_id, cluster_id, post_id, openai_key, article, target_audience, topic } = await request.json()

        if (!job_id || !post_id || !openai_key || !article) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // Master content generation prompt
        const contentPrompt = `You are a Senior Wealth Strategist and Fiduciary Architect at Everence Wealth, a San Francisco-based independent financial firm.

BRAND VOICE:
- Contrarian but respectful
- Analytical but accessible
- Educational over promotional
- Fiduciary-first (client's best interest)
- Expose Wall Street inefficiencies (fees, volatility, taxes)

CORE FRAMEWORKS (use at least ONE in the article):
- The Three Tax Buckets (Taxable / Tax-Deferred / Tax-Exempt)
- The Three Silent Killers (Fees, Volatility, Taxes)
- Zero is Your Hero (0% tax strategy)
- Cash Flow > Net Worth
- Human Life Value
- Living Benefits

CLUSTER TOPIC: ${topic}
TARGET AUDIENCE: ${target_audience}

HEADLINE: ${article.headline}
KEYWORD: ${article.targetKeyword}
FUNNEL STAGE: ${article.funnelStage?.toUpperCase()}
SEARCH INTENT: ${article.searchIntent}
CONTENT ANGLE: ${article.contentAngle}

ARTICLE REQUIREMENTS:
- 2,000–2,500 words
- 6–8 H2 sections with clear, descriptive headings
- 5–8 FAQ questions at the end (80–120 word answers, single paragraphs each)
- Professional, institutional tone
- Include math examples where relevant (Rule of 72, volatility recovery, compound interest)
- No guaranteed returns promises
- Naturally incorporate keywords throughout
- Start with a compelling hook (no "In today's..." openers)
- End with CTA: Schedule a Financial Needs Assessment with Everence Wealth
- Do NOT include the title/headline as an H1 — the CMS handles that

Write the complete article in HTML format.

After the article HTML, include a meta description (under 160 characters) on its own line after "META:" label.`

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openai_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: contentPrompt }],
                max_tokens: 12000,
            }),
        })

        if (!openaiResponse.ok) {
            const errBody = await openaiResponse.text()
            throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errBody}`)
        }

        const openaiData = await openaiResponse.json()
        const rawContent = openaiData.choices[0].message.content
        if (!rawContent) throw new Error('No content generated from OpenAI')

        // Extract meta description
        let articleContent = rawContent
        let metaDesc = article.searchIntent || ''
        const metaMatch = rawContent.match(/META:\s*(.+?)$/m)
        if (metaMatch) {
            metaDesc = metaMatch[1].trim()
            articleContent = rawContent.replace(/META:\s*.+?$/m, '').trim()
        }

        const wordCount = articleContent.split(/\s+/).length
        const readingTime = Math.max(1, Math.round(wordCount / 200))

        // Update blog post with generated content
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({
                content: articleContent,
                word_count: wordCount,
                reading_time: readingTime,
                meta_description: metaDesc,
                status: 'review',
            })
            .eq('id', post_id)

        if (updateError) {
            console.error('Post update error:', updateError)
            throw new Error('Failed to update post: ' + updateError.message)
        }

        // Atomic increment of completed articles
        await supabase.rpc('increment_completed_articles', { gen_id: job_id })

        // Update heartbeat
        await supabase
            .from('cluster_generations')
            .update({ last_heartbeat: new Date().toISOString() })
            .eq('id', job_id)

        // Update cluster counts
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('language, status')
            .eq('cluster_id', cluster_id)
            .in('status', ['review', 'published'])

        const enCount = posts?.filter((p: any) => p.language === 'en').length || 0
        const esCount = posts?.filter((p: any) => p.language === 'es').length || 0

        await supabase
            .from('clusters')
            .update({
                content_count: enCount + esCount,
                en_count: enCount,
                es_count: esCount,
                status: (enCount + esCount) >= 12 ? 'active' : enCount >= 6 ? 'draft' : 'generating',
            })
            .eq('id', cluster_id)

        return NextResponse.json({ success: true, word_count: wordCount })
    } catch (error: any) {
        console.error('Generate chunk error:', error)

        // Try to log to system_errors
        try {
            const supabase = createAdminClient()
            await supabase.from('system_errors').insert({
                error_message: error.message || String(error),
                source: 'api.clusters.generate-chunk',
                severity: 'error',
                status: 'new',
            })
        } catch (_) {}

        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
