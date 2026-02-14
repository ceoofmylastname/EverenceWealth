import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH /api/articles/[id] — update article fields
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, content, meta_title, meta_description, keywords } = body

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
        }

        if (title !== undefined) updateData.title = title
        if (content !== undefined) {
            updateData.content = content
            // Recalculate word count and reading time
            const text = content.replace(/<[^>]*>/g, '')
            const wordCount = text.split(/\s+/).filter(Boolean).length
            updateData.word_count = wordCount
            updateData.reading_time = Math.max(1, Math.round(wordCount / 200))
        }
        if (meta_title !== undefined) updateData.meta_title = meta_title
        if (meta_description !== undefined) updateData.meta_description = meta_description
        if (keywords !== undefined) updateData.keywords = keywords

        const { data, error } = await supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            throw new Error('Failed to update article: ' + error.message)
        }

        return NextResponse.json({ success: true, article: data })
    } catch (error: any) {
        console.error('Update article error:', error)
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }
}
