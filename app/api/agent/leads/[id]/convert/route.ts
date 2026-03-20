import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// POST /api/agent/leads/[id]/convert — convert a lead to a client
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '') || ''
        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 401 })
        }

        const serviceClient = createServiceClient()
        const { data: { user }, error: authError } = await serviceClient.auth.getUser(token)
        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { data: advisor } = await serviceClient
            .from('advisors')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (!advisor) {
            return NextResponse.json({ error: 'Not an advisor' }, { status: 403 })
        }

        // Fetch the lead
        const { data: lead, error: leadError } = await serviceClient
            .from('leads')
            .select('*')
            .eq('id', params.id)
            .eq('assigned_advisor_id', advisor.id)
            .single()

        if (leadError || !lead) {
            return NextResponse.json({ error: 'Lead not found or not assigned to you' }, { status: 404 })
        }

        if (lead.status === 'converted') {
            return NextResponse.json({ error: 'Lead already converted' }, { status: 409 })
        }

        // Create client record
        const { data: client, error: clientError } = await serviceClient
            .from('clients')
            .insert({
                lead_id: lead.id,
                advisor_id: advisor.id,
                first_name: lead.first_name,
                last_name: lead.last_name,
                email: lead.email,
                phone: lead.phone || null,
            })
            .select()
            .single()

        if (clientError) {
            return NextResponse.json({ error: clientError.message }, { status: 500 })
        }

        // Update lead status to converted
        await serviceClient
            .from('leads')
            .update({
                status: 'converted',
                converted_at: new Date().toISOString(),
            })
            .eq('id', lead.id)

        return NextResponse.json({ client })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
    }
}
