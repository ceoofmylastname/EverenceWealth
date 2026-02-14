import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { decrypt } from '@/app/admin/(dashboard)/settings/utils'
import { randomUUID } from 'crypto'

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

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const clusterId = params.id

        // Verify cluster exists
        const { data: cluster, error: clusterError } = await supabase
            .from('clusters')
            .select('*')
            .eq('id', clusterId)
            .single()

        if (clusterError || !cluster) {
            return NextResponse.json({ error: 'Cluster not found' }, { status: 404 })
        }

        // Check if translations already exist
        if (cluster.es_count && cluster.es_count >= 6) {
            return NextResponse.json({ error: 'Spanish translations already exist for this cluster' }, { status: 400 })
        }

        // Fetch all English posts in this cluster
        const { data: enPosts, error: postsError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('cluster_id', clusterId)
            .eq('language', 'en')
            .in('status', ['review', 'published'])
            .order('funnel_position', { ascending: true })

        if (postsError || !enPosts || enPosts.length === 0) {
            return NextResponse.json(
                { error: 'No English articles found to translate. Generate English content first.' },
                { status: 400 }
            )
        }

        const openaiKey = await getOpenAIKey(supabase)
        if (!openaiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured. Add it in Settings or set OPENAI_API_KEY env var.' },
                { status: 500 }
            )
        }

        // Create ES blog post records and link via hreflang_group_id
        const esPosts = []
        for (const enPost of enPosts) {
            const hreflangGroupId = randomUUID()

            // Update EN post with hreflang_group_id
            await supabase
                .from('blog_posts')
                .update({ hreflang_group_id: hreflangGroupId })
                .eq('id', enPost.id)

            // Create ES post record
            const esSlug = enPost.slug + '-es'
            const { data: esPost, error: esError } = await supabase
                .from('blog_posts')
                .insert({
                    cluster_id: clusterId,
                    title: `[Translating] ${enPost.title}`,
                    slug: esSlug,
                    funnel_stage: enPost.funnel_stage,
                    funnel_position: enPost.funnel_position,
                    language: 'es',
                    hreflang_group_id: hreflangGroupId,
                    keywords: enPost.keywords,
                    status: 'generating',
                })
                .select()
                .single()

            if (esError || !esPost) {
                console.error('Failed to create ES post:', esError)
                continue
            }

            esPosts.push({ enPost, esPost })
        }

        // Fire-and-forget: invoke translate-chunk for each pair
        const baseUrl = new URL(request.url)
        const chunkUrl = `${baseUrl.origin}/api/clusters/translate-chunk`

        for (const { enPost, esPost } of esPosts) {
            fetch(chunkUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cluster_id: clusterId,
                    en_post_id: enPost.id,
                    es_post_id: esPost.id,
                    openai_key: openaiKey,
                }),
            }).catch((err) => {
                console.error(`Failed to invoke translate-chunk for post ${esPost.id}:`, err)
            })
        }

        return NextResponse.json({
            cluster_id: clusterId,
            translating: true,
            translation_count: esPosts.length,
        })
    } catch (error: any) {
        console.error('Translate cluster error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
