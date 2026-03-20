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
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { data: health } = await supabase
        .from('financial_health')
        .select('*')
        .eq('client_id', client.id)
        .single()

    return NextResponse.json(health || { health_score: 0 })
}

export async function POST() {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client } = await supabase
        .from('clients')
        .select('id, annual_income')
        .eq('user_id', user.id)
        .single()

    if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Calculate health score
    const [policiesRes, accountsRes, existingHealth] = await Promise.all([
        supabase.from('policies').select('coverage_amount, premium_amount, premium_frequency, status').eq('client_id', client.id),
        supabase.from('accounts').select('current_value').eq('client_id', client.id).eq('status', 'active'),
        supabase.from('financial_health').select('emergency_fund_months, debt_to_income_ratio').eq('client_id', client.id).single(),
    ])

    const policies = (policiesRes.data || []).filter(p => p.status === 'active')
    const accounts = accountsRes.data || []

    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0)
    const totalAssets = accounts.reduce((sum, a) => sum + (a.current_value || 0), 0)
    const totalPremiumsAnnual = policies.reduce((sum, p) => {
        const amount = p.premium_amount || 0
        if (p.premium_frequency === 'monthly') return sum + amount * 12
        if (p.premium_frequency === 'quarterly') return sum + amount * 4
        return sum + amount
    }, 0)

    const emergencyMonths = existingHealth.data?.emergency_fund_months || 0
    const dtiRatio = existingHealth.data?.debt_to_income_ratio || 0

    // Score calculation (simplified)
    let score = 0
    // Coverage score (0-25): Do they have life insurance?
    if (policies.length > 0) score += 15
    if (totalCoverage > 500000) score += 10
    // Assets score (0-25): Do they have investments?
    if (accounts.length > 0) score += 15
    if (totalAssets > 100000) score += 10
    // Emergency fund (0-25)
    score += Math.min(25, emergencyMonths * 4)
    // Debt ratio (0-25): Lower is better
    if (dtiRatio <= 0.2) score += 25
    else if (dtiRatio <= 0.35) score += 15
    else if (dtiRatio <= 0.5) score += 5

    score = Math.min(100, Math.max(0, score))

    const { data: updated, error } = await supabase
        .from('financial_health')
        .upsert({
            client_id: client.id,
            health_score: score,
            total_coverage: totalCoverage,
            total_assets: totalAssets,
            total_premiums_annual: totalPremiumsAnnual,
            emergency_fund_months: emergencyMonths,
            debt_to_income_ratio: dtiRatio,
            last_calculated: new Date().toISOString(),
        }, { onConflict: 'client_id' })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(updated)
}
