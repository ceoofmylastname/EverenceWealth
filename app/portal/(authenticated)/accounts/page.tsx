'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import AccountCard from '@/components/portal/account-card'
import { Loader2, Wallet } from 'lucide-react'

export default function AccountsPage() {
    const { user } = useAuth()
    const [accounts, setAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadAccounts()
    }, [user])

    async function loadAccounts() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }

            const { data } = await supabase
                .from('accounts')
                .select('*')
                .eq('client_id', client.id)
                .order('current_value', { ascending: false })

            setAccounts(data || [])
        } catch (err) {
            console.error('Failed to load accounts:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const activeAccounts = accounts.filter(a => a.status === 'active')
    const totalValue = activeAccounts.reduce((sum, a) => sum + (a.current_value || 0), 0)
    const totalGainLoss = activeAccounts.reduce((sum, a) => sum + (a.gain_loss_ytd || 0), 0)

    // Tax bucket breakdown
    const taxBuckets = {
        taxable: activeAccounts.filter(a => a.tax_bucket === 'taxable').reduce((s, a) => s + (a.current_value || 0), 0),
        tax_deferred: activeAccounts.filter(a => a.tax_bucket === 'tax_deferred').reduce((s, a) => s + (a.current_value || 0), 0),
        tax_exempt: activeAccounts.filter(a => a.tax_bucket === 'tax_exempt').reduce((s, a) => s + (a.current_value || 0), 0),
    }

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
                <h1 className="text-2xl font-bold text-[#1A4D3E]">My Accounts</h1>
                <p className="text-[#4A5565] text-sm mt-1">Track your investments and account values</p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">Total Assets</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{formatCurrency(totalValue)}</p>
                </div>
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">Active Accounts</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{activeAccounts.length}</p>
                </div>
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <p className="text-sm text-[#4A5565]">YTD Gain/Loss</p>
                    <p className={`text-2xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
                    </p>
                </div>
            </div>

            {/* Tax Bucket Breakdown */}
            {activeAccounts.length > 0 && (
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Three Tax Buckets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-orange-50 border border-orange-100">
                            <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Taxable</p>
                            <p className="text-xl font-bold text-orange-700 mt-1">{formatCurrency(taxBuckets.taxable)}</p>
                            {totalValue > 0 && (
                                <div className="mt-2 bg-orange-100 h-2">
                                    <div className="bg-orange-500 h-2" style={{ width: `${(taxBuckets.taxable / totalValue) * 100}%` }} />
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100">
                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Tax-Deferred</p>
                            <p className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(taxBuckets.tax_deferred)}</p>
                            {totalValue > 0 && (
                                <div className="mt-2 bg-blue-100 h-2">
                                    <div className="bg-blue-500 h-2" style={{ width: `${(taxBuckets.tax_deferred / totalValue) * 100}%` }} />
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100">
                            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Tax-Exempt</p>
                            <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(taxBuckets.tax_exempt)}</p>
                            {totalValue > 0 && (
                                <div className="mt-2 bg-emerald-100 h-2">
                                    <div className="bg-emerald-500 h-2" style={{ width: `${(taxBuckets.tax_exempt / totalValue) * 100}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Account cards */}
            {accounts.length === 0 ? (
                <div className="bg-white p-12 border border-[#4A5565]/10 shadow-sm text-center">
                    <Wallet className="h-12 w-12 text-[#4A5565]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1A4D3E]">No accounts yet</h3>
                    <p className="text-sm text-[#4A5565] mt-1">
                        Your advisor will add your accounts here once they are set up.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {accounts.map((account) => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            )}
        </div>
    )
}
