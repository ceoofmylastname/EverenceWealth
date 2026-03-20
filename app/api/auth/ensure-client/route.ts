import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}))
        const accessToken = body.access_token

        if (!accessToken) {
            return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
        }

        const serviceClient = createServiceClient()

        // Verify the user using their access token (no cookie dependency)
        const { data: { user }, error: authError } = await serviceClient.auth.getUser(accessToken)

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Check if user already has a role
        const { data: admin } = await serviceClient
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (admin) {
            return NextResponse.json({ role: 'admin' })
        }

        const { data: advisor } = await serviceClient
            .from('advisors')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (advisor) {
            return NextResponse.json({ role: 'advisor' })
        }

        const { data: existingClient } = await serviceClient
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .single()
        if (existingClient) {
            return NextResponse.json({ role: 'client' })
        }

        // No role found — create client record
        // advisor_id is NOT NULL with FK to advisors, so we need a real advisor
        // Use client-selected advisor if provided, otherwise find default
        let advisorId: string = ''
        const requestedAdvisorId = body.advisor_id

        if (requestedAdvisorId) {
            // Verify the requested advisor exists
            const { data: selectedAdvisor } = await serviceClient
                .from('advisors')
                .select('id')
                .eq('id', requestedAdvisorId)
                .eq('status', 'active')
                .single()
            if (selectedAdvisor) {
                advisorId = selectedAdvisor.id
            }
        }

        if (!advisorId) {
            const { data: defaultAdvisor } = await serviceClient
                .from('advisors')
                .select('id')
                .eq('status', 'active')
                .limit(1)
                .single()
            if (defaultAdvisor) {
                advisorId = defaultAdvisor.id
            }
        }

        if (!advisorId) {
            // No advisors exist — create a placeholder advisor
            const { data: newAdvisor, error: advisorError } = await serviceClient
                .from('advisors')
                .insert({
                    first_name: 'Unassigned',
                    last_name: 'Advisor',
                    email: 'unassigned@everencewealth.com',
                    status: 'active',
                })
                .select('id')
                .single()

            if (advisorError || !newAdvisor) {
                return NextResponse.json(
                    { error: advisorError?.message || 'Failed to create default advisor' },
                    { status: 500 }
                )
            }
            advisorId = newAdvisor.id
        }

        const meta = user.user_metadata || {}
        const { error: insertError } = await serviceClient.from('clients').insert({
            user_id: user.id,
            first_name: meta.first_name || '',
            last_name: meta.last_name || '',
            email: user.email || '',
            phone: meta.phone || null,
            advisor_id: advisorId,
        })

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message, detail: 'Failed to create client record' },
                { status: 500 }
            )
        }

        return NextResponse.json({ role: 'client', created: true })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
    }
}
