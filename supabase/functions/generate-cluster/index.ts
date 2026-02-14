import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Validate auth
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing authorization header')

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
        if (authError || !user) throw new Error('Unauthorized')

        // 2. Parse request
        const { topic, primary_keyword, target_audience, language = 'en' } = await req.json()
        if (!topic || !primary_keyword || !target_audience) {
            throw new Error('Missing required fields: topic, primary_keyword, target_audience')
        }

        // 3. Get OpenAI key
        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openaiKey) throw new Error('OPENAI_API_KEY not configured')

        // 4. Create cluster
        const clusterName = topic.length > 60 ? topic.substring(0, 60) + '...' : topic
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

        const { data: cluster, error: clusterError } = await supabaseAdmin
            .from('clusters')
            .insert({
                name: clusterName,
                slug,
                topic,
                target_audience,
                keywords: [primary_keyword],
                funnel_strategy: '3-2-1',
                required_content_count: 6,
                content_count: 0,
                status: 'generating',
            })
            .select()
            .single()

        if (clusterError) throw clusterError

        // 5. Create generation job
        const { data: generation, error: genError } = await supabaseAdmin
            .from('cluster_generations')
            .insert({
                cluster_id: cluster.id,
                status: 'processing',
                topic,
                primary_keyword,
                target_audience,
                language,
                total_articles: 6,
                completed_articles: 0,
                user_id: user.id,
                started_at: new Date().toISOString(),
                last_heartbeat: new Date().toISOString(),
            })
            .select()
            .single()

        if (genError) throw genError

        // 6. Generate article topics with OpenAI
        const topicPrompt = `You are a content strategist for Everence Wealth, a fiduciary financial firm.

Given this cluster topic and keywords, generate 6 strategic article topics that follow a content funnel:

CLUSTER TOPIC: ${topic}
TARGET AUDIENCE: ${target_audience}
CORE KEYWORDS: ${primary_keyword}

Generate topics following this structure:

3 TOFU (Top of Funnel) Articles:
- Educational, eye-opening content
- Focus on problems and awareness
- Question-based titles
- Address: "What is...", "Why should I care...", "Is my [retirement/portfolio] at risk?"

2 MOFU (Middle of Funnel) Articles:
- Comparison and evaluation content
- Focus on solutions and alternatives
- Comparison-based titles
- Address: "X vs Y", "How to choose...", "Which strategy is right..."

1 BOFU (Bottom of Funnel) Article:
- Action-oriented, strategic content
- Focus on implementation and next steps
- Outcome-based titles
- Address: "How to bridge...", "Your complete guide to...", "Strategic plan for..."

OUTPUT FORMAT (JSON):
{
  "tofu": [
    { "title": "Article title as question", "focus": "What this article educates on", "keywords": ["keyword1", "keyword2"] }
  ],
  "mofu": [
    { "title": "Comparison or evaluation title", "focus": "What solutions this compares", "keywords": ["keyword3", "keyword4"] }
  ],
  "bofu": [
    { "title": "Action-oriented strategic title", "focus": "Implementation plan", "keywords": ["keyword5", "keyword6"] }
  ]
}`

        const topicResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: topicPrompt }],
                response_format: { type: 'json_object' },
            }),
        })

        if (!topicResponse.ok) {
            const errText = await topicResponse.text()
            throw new Error(`OpenAI topic generation failed: ${topicResponse.status} - ${errText}`)
        }

        const topicData = await topicResponse.json()
        const articles = JSON.parse(topicData.choices[0].message.content)

        // 7. Create blog_post records
        const postsToInsert: any[] = []
        const stages = [
            { key: 'tofu', items: articles.tofu || [] },
            { key: 'mofu', items: articles.mofu || [] },
            { key: 'bofu', items: articles.bofu || [] },
        ]

        for (const stage of stages) {
            for (let i = 0; i < stage.items.length; i++) {
                const article = stage.items[i]
                postsToInsert.push({
                    cluster_id: cluster.id,
                    title: article.title,
                    slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
                    funnel_stage: stage.key,
                    funnel_position: i + 1,
                    keywords: article.keywords,
                    status: 'generating',
                    meta_description: article.focus,
                })
            }
        }

        const { data: posts, error: postsError } = await supabaseAdmin
            .from('blog_posts')
            .insert(postsToInsert)
            .select('id, funnel_stage, funnel_position, title, meta_description, keywords')

        if (postsError) throw postsError

        // 8. Fire-and-forget: invoke generate-cluster-chunk for each post
        const chunkUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-cluster-chunk`

        for (const post of posts!) {
            fetch(chunkUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post.id,
                    cluster_id: cluster.id,
                    generation_id: generation.id,
                    topic,
                    target_audience,
                    keywords: [primary_keyword],
                    funnel_stage: post.funnel_stage,
                    funnel_position: post.funnel_position,
                    title: post.title,
                    focus: post.meta_description,
                    post_keywords: post.keywords,
                }),
            }).catch((err) => {
                console.error(`Failed to invoke chunk for post ${post.id}:`, err)
            })
        }

        // 9. Return immediately
        return new Response(
            JSON.stringify({
                success: true,
                generation_id: generation.id,
                cluster_id: cluster.id,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        console.error('generate-cluster error:', error)
        return new Response(
            JSON.stringify({ error: error.message || String(error) }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
