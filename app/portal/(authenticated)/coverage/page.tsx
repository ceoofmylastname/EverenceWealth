'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import PolicyCard from '@/components/portal/policy-card'
import { Loader2, Shield } from 'lucide-react'

export default function CoveragePage() {
    const { user } = useAuth()
    const [policies, setPolicies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadPolicies()
    }, [user])

    async function loadPolicies() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }

            const { data } = await supabase
                .from('policies')
                .select('*')
                .eq('client_id', client.id)
                .order('created_at', { ascending: false })

            setPolicies(data || [])
        } catch (err) {
            console.error('Failed to load policies:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0)
    const activePolicies = policies.filter(p => p.status === 'active')
    const totalPremiumMonthly = policies.reduce((sum, p) => {
        if (p.status !== 'active') return sum
        const amount = p.premium_amount || 0
        if (p.premium_frequency === 'annual') return sum + amount / 12
        if (p.premium_frequency === 'quarterly') return sum + amount / 3
        return sum + amount
    }, 0)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#1A4D3E]">My Coverage</h1>
                <p className="text-[#4A5565] text-sm mt-1">View and manage your insurance policies</p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">Total Coverage</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{formatCurrency(totalCoverage)}</p>
                </div>
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">Active Policies</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{activePolicies.length}</p>
                </div>
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">Monthly Premiums</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{formatCurrency(totalPremiumMonthly)}</p>
                </div>
            </div>

            {/* Coverage breakdown */}
            {policies.length > 0 && (
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Coverage Breakdown</h3>
                    <div className="space-y-3">
                        {policies.filter(p => p.status === 'active').map(policy => {
                            const pct = totalCoverage > 0 ? (policy.coverage_amount / totalCoverage) * 100 : 0
                            return (
                                <div key={policy.id} className="flex items-center gap-4">
                                    <div className="w-32 text-sm text-[#4A5565] truncate capitalize">
                                        {policy.policy_type.replace('_', ' ')}
                                    </div>
                                    <div className="flex-1 bg-[#f0f2f1] h-3">
                                        <div
                                            className="bg-[#1A4D3E] h-3 transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="w-20 text-sm font-medium text-[#1A4D3E] text-right">
                                        {formatCurrency(policy.coverage_amount)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Policy cards */}
            {policies.length === 0 ? (
                <div className="bg-white p-12 border border-[#4A5565]/10 shadow-sm text-center">
                    <Shield className="h-12 w-12 text-[#4A5565]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1A4D3E]">No policies yet</h3>
                    <p className="text-sm text-[#4A5565] mt-1">
                        Your advisor will add your policies here once they are set up.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {policies.map((policy) => (
                        <PolicyCard key={policy.id} policy={policy} />
                    ))}
                </div>
            )}
        </div>
    )
}
