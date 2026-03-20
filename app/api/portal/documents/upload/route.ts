import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = (formData.get('document_type') as string) || 'other'
    const description = formData.get('description') as string | null

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const filePath = `${client.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

    const { data: doc, error: insertError } = await supabase
        .from('document_vault')
        .insert({
            client_id: client.id,
            uploaded_by_type: 'client',
            uploaded_by_id: user.id,
            document_type: documentType as any,
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            year: new Date().getFullYear(),
            description,
        })
        .select()
        .single()

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(doc)
}
