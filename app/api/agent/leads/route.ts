import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/agent/leads — fetch unclaimed leads (advisor can't read these via RLS)
export async function GET(request: NextRequest) {
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

        // Verify user is an advisor
        const { data: advisor } = await serviceClient
            .from('advisors')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (!advisor) {
            return NextResponse.json({ error: 'Not an advisor' }, { status: 403 })
        }

        // Fetch unclaimed leads
        const { data: leads, error } = await serviceClient
            .from('leads')
            .select('*')
            .is('assigned_advisor_id', null)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ leads, advisor_id: advisor.id })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
    }
}

// POST /api/agent/leads — claim a lead
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '') || ''
        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 401 })
        }

        const body = await request.json()
        const { lead_id } = body

        if (!lead_id) {
            return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 })
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

        // Claim the lead
        const { data: lead, error } = await serviceClient
            .from('leads')
            .update({
                assigned_advisor_id: advisor.id,
                claimed_at: new Date().toISOString(),
                status: 'contacted',
            })
            .eq('id', lead_id)
            .is('assigned_advisor_id', null)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!lead) {
            return NextResponse.json({ error: 'Lead already claimed' }, { status: 409 })
        }

        return NextResponse.json({ lead })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
    }
}
