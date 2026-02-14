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
        const { cluster_id, en_post_id, es_post_id, openai_key } = await request.json()

        if (!cluster_id || !en_post_id || !es_post_id || !openai_key) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // Fetch the English post
        const { data: enPost, error: enError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', en_post_id)
            .single()

        if (enError || !enPost) {
            throw new Error('English post not found: ' + (enError?.message || 'Unknown'))
        }

        // Translation prompt
        const translationPrompt = `You are a professional English-to-Spanish translator for Everence Wealth, a San Francisco-based fiduciary wealth management firm.

Translate the following blog article from English to Spanish.

RULES:
- Translate ALL content including headings, paragraphs, lists, FAQ questions and answers
- Keep HTML tags and structure exactly intact — only translate the text content within tags
- Use formal "usted" form throughout (professional financial context)
- Keep proper nouns untranslated: Everence Wealth, San Francisco, Roth IRA, 401(k), HSA
- Keep brand framework names in English with Spanish explanation in parentheses on first use:
  e.g., "Three Tax Buckets (Tres Categorías Fiscales)"
  e.g., "Silent Killers (Asesinos Silenciosos)"
  e.g., "Zero is Your Hero (Cero es Tu Héroe)"
- Translate the CTA: "Schedule a Financial Needs Assessment" → "Programe una Evaluación de Necesidades Financieras con Everence Wealth"
- Financial terms should use standard Latin American Spanish financial terminology
- Also translate the title and meta description

TITLE: ${enPost.title}
META DESCRIPTION: ${enPost.meta_description || ''}

ARTICLE HTML:
${enPost.content}

Return a valid JSON object with exactly these keys:
{
  "title": "translated title in Spanish",
  "meta_description": "translated meta description in Spanish (under 160 characters)",
  "content": "translated HTML content in Spanish"
}`

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openai_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: translationPrompt }],
                response_format: { type: 'json_object' },
                max_tokens: 12000,
            }),
        })

        if (!openaiResponse.ok) {
            const errBody = await openaiResponse.text()
            throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errBody}`)
        }

        const openaiData = await openaiResponse.json()
        const rawContent = openaiData.choices[0].message.content
        if (!rawContent) throw new Error('No content returned from OpenAI')

        const translated = JSON.parse(rawContent)

        if (!translated.title || !translated.content) {
            throw new Error('Invalid translation response: missing title or content')
        }

        const wordCount = translated.content.split(/\s+/).length
        const readingTime = Math.max(1, Math.round(wordCount / 200))

        // Update the ES blog post with translated content
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({
                title: translated.title,
                content: translated.content,
                meta_description: translated.meta_description || enPost.meta_description,
                meta_title: translated.title,
                word_count: wordCount,
                reading_time: readingTime,
                status: 'review',
            })
            .eq('id', es_post_id)

        if (updateError) {
            throw new Error('Failed to update ES post: ' + updateError.message)
        }

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
        console.error('Translate chunk error:', error)

        // Try to log to system_errors
        try {
            const supabase = createAdminClient()
            await supabase.from('system_errors').insert({
                error_message: error.message || String(error),
                source: 'api.clusters.translate-chunk',
                severity: 'error',
                status: 'new',
            })
        } catch (_) {}

        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
