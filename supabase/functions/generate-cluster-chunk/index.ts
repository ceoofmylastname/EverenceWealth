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

    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let postId = ''

    try {
        // 1. Validate caller (service role key from orchestrator or user JWT)
        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '') || ''
        const isServiceRole = token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!isServiceRole) {
            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
            if (error || !user) throw new Error('Unauthorized')
        }

        // 2. Parse body
        const {
            post_id, cluster_id, generation_id,
            topic, target_audience, keywords,
            funnel_stage, title, focus, post_keywords,
        } = await req.json()

        postId = post_id

        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openaiKey) throw new Error('OPENAI_API_KEY not configured')

        // 3. Build content generation prompt (Master Prompt)
        const stageContext: Record<string, string> = {
            tofu: `FUNNEL CONTEXT: This is a Top of Funnel (Awareness) article. Write educational, eye-opening content that identifies problems and builds awareness. The tone should make the reader realize they have a problem they didn't know about. Focus on "What is...", "Why should I care...", "Is my retirement at risk?" angles.`,
            mofu: `FUNNEL CONTEXT: This is a Middle of Funnel (Consideration) article. Write comparison and evaluation content that explores solutions and alternatives. Help the reader understand their options and what to look for. Focus on "X vs Y", "How to choose...", "Which strategy is right..." angles.`,
            bofu: `FUNNEL CONTEXT: This is a Bottom of Funnel (Decision) article. Write action-oriented, strategic content that guides the reader toward implementation and next steps. Focus on "How to bridge...", "Your complete guide to...", "Strategic plan for..." angles. Include a strong call to action.`,
        }

        const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : (keywords || '')
        const postKeywordsStr = Array.isArray(post_keywords) ? post_keywords.join(', ') : (post_keywords || '')

        const prompt = `You are a Senior Wealth Strategist and Fiduciary Architect at Everence Wealth, a San Francisco-based independent financial firm.

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
CLUSTER KEYWORDS: ${keywordsStr}

HEADLINE: ${title}
KEYWORD: ${postKeywordsStr}
FUNNEL STAGE: ${funnel_stage?.toUpperCase()}
AUDIENCE: ${target_audience}
ARTICLE FOCUS: ${focus || ''}
${stageContext[funnel_stage] || ''}

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

        // 4. Call OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            }),
        })

        if (!response.ok) {
            const errBody = await response.text()
            throw new Error(`OpenAI API error: ${response.status} - ${errBody}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content
        if (!content) throw new Error('No content generated from OpenAI')

        // 5. Extract meta description
        let articleContent = content
        let metaDesc = focus
        const metaMatch = content.match(/META:\s*(.+?)$/m)
        if (metaMatch) {
            metaDesc = metaMatch[1].trim()
            articleContent = content.replace(/META:\s*.+?$/m, '').trim()
        }

        // 6. Calculate reading time
        const wordCount = articleContent.split(/\s+/).length
        const readingTime = Math.max(1, Math.round(wordCount / 200))

        // 7. Update blog_post
        const { error: updateError } = await supabaseAdmin
            .from('blog_posts')
            .update({
                content: articleContent,
                meta_description: metaDesc,
                reading_time: readingTime,
                status: 'review',
                updated_at: new Date().toISOString(),
            })
            .eq('id', post_id)

        if (updateError) throw updateError

        // 8. Atomic increment of completed_articles
        const { data: result } = await supabaseAdmin.rpc('increment_completed_articles', {
            gen_id: generation_id,
        })

        const isComplete = result?.[0]?.is_complete || false

        // 9. Update cluster content_count
        const { data: allPosts } = await supabaseAdmin
            .from('blog_posts')
            .select('id, status')
            .eq('cluster_id', cluster_id)

        const completedCount = allPosts?.filter((p: any) => p.status !== 'draft' && p.status !== 'generating').length || 0

        await supabaseAdmin
            .from('clusters')
            .update({
                content_count: completedCount,
                status: isComplete ? 'draft' : 'generating',
                updated_at: new Date().toISOString(),
            })
            .eq('id', cluster_id)

        return new Response(
            JSON.stringify({ success: true, post_id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        console.error('generate-cluster-chunk error:', error)

        // Log to system_errors
        await supabaseAdmin.from('system_errors').insert({
            error_message: error.message || String(error),
            source: 'edge-function.generate-cluster-chunk',
            severity: 'error',
            error_details: { post_id: postId },
            status: 'new',
        }).catch(() => {})

        return new Response(
            JSON.stringify({ error: error.message || String(error) }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
