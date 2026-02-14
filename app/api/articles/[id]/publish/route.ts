import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/articles/[id]/publish — publish a single article
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

        const { data, error } = await supabase
            .from('blog_posts')
            .update({
                status: 'published',
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            throw new Error('Failed to publish article: ' + error.message)
        }

        return NextResponse.json({ success: true, article: data })
    } catch (error: any) {
        console.error('Publish article error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}

// DELETE /api/articles/[id]/publish — unpublish a single article
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .update({
                status: 'review',
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            throw new Error('Failed to unpublish article: ' + error.message)
        }

        return NextResponse.json({ success: true, article: data })
    } catch (error: any) {
        console.error('Unpublish article error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
