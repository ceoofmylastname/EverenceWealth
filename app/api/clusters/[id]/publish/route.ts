import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
            .select('id, name, status')
            .eq('id', clusterId)
            .single()

        if (clusterError || !cluster) {
            return NextResponse.json({ error: 'Cluster not found' }, { status: 404 })
        }

        // Publish all review articles in this cluster
        const { error: postsError, count } = await supabase
            .from('blog_posts')
            .update({
                status: 'published',
                updated_at: new Date().toISOString(),
            })
            .eq('cluster_id', clusterId)
            .eq('status', 'review')

        if (postsError) {
            throw new Error('Failed to publish posts: ' + postsError.message)
        }

        // Update cluster status to active
        const { error: updateError } = await supabase
            .from('clusters')
            .update({ status: 'active' })
            .eq('id', clusterId)

        if (updateError) {
            throw new Error('Failed to update cluster: ' + updateError.message)
        }

        return NextResponse.json({
            success: true,
            published_count: count || 0,
            cluster_name: cluster.name,
        })
    } catch (error: any) {
        console.error('Publish cluster error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
