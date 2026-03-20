import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client } = await supabase
        .from('clients')
        .select('id, advisor_id')
        .eq('user_id', user.id)
        .single()

    if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const [
        policiesRes,
        accountsRes,
        healthRes,
        appointmentsRes,
        messagesRes,
    ] = await Promise.all([
        supabase.from('policies').select('coverage_amount, status').eq('client_id', client.id),
        supabase.from('accounts').select('current_value').eq('client_id', client.id).eq('status', 'active'),
        supabase.from('financial_health').select('*').eq('client_id', client.id).single(),
        supabase.from('appointments').select('id').eq('client_id', client.id).gte('scheduled_at', new Date().toISOString()).neq('status', 'cancelled'),
        supabase.from('messages').select('id', { count: 'exact' }).eq('recipient_id', client.id).eq('recipient_type', 'client').eq('read', false),
    ])

    const policies = policiesRes.data || []
    const accounts = accountsRes.data || []

    return NextResponse.json({
        totalCoverage: policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0),
        totalAssets: accounts.reduce((sum, a) => sum + (a.current_value || 0), 0),
        activePolicies: policies.filter(p => p.status === 'active').length,
        healthScore: healthRes.data?.health_score || 0,
        upcomingAppointments: appointmentsRes.data?.length || 0,
        unreadMessages: messagesRes.count || 0,
    })
}
