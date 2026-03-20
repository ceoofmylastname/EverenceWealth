'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import StatCard from '@/components/portal/stat-card'
import FinancialHealthGauge from '@/components/portal/financial-health-gauge'
import AdvisorCard from '@/components/portal/advisor-card'
import { Shield, Wallet, FileText, Calendar, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
    clientProfile: any
    advisor: any
    healthScore: number
    totalCoverage: number
    totalAssets: number
    activePolicies: number
    upcomingAppointments: any[]
    unreadMessages: number
    recentDocuments: any[]
}

export default function PortalDashboardPage() {
    const { user } = useAuth()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        loadDashboard()
    }, [user])

    async function loadDashboard() {
        try {
            const supabase = createClient()

            const { data: clientProfile, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', user!.id)
                .single()

            if (clientError || !clientProfile) {
                setError('Could not load your profile.')
                setLoading(false)
                return
            }

            let advisorData = null
            if (clientProfile.advisor_id) {
                try {
                    const res = await fetch('/api/advisors/public')
                    const json = await res.json()
                    advisorData = (json.advisors || []).find((a: any) => a.id === clientProfile.advisor_id) || null
                } catch {}
            }

            const [policiesRes, accountsRes, healthRes, appointmentsRes, messagesRes, docsRes] = await Promise.all([
                supabase.from('policies').select('coverage_amount, status').eq('client_id', clientProfile.id),
                supabase.from('accounts').select('current_value').eq('client_id', clientProfile.id).eq('status', 'active'),
                supabase.from('financial_health').select('health_score').eq('client_id', clientProfile.id).maybeSingle(),
                supabase.from('appointments').select('*').eq('client_id', clientProfile.id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(3),
                supabase.from('messages').select('id', { count: 'exact' }).eq('recipient_id', clientProfile.id).eq('recipient_type', 'client').eq('read', false),
                supabase.from('document_vault').select('*').eq('client_id', clientProfile.id).order('created_at', { ascending: false }).limit(5),
            ])

            const policies = policiesRes.data || []
            const accounts = accountsRes.data || []

            setData({
                clientProfile,
                advisor: advisorData,
                healthScore: healthRes.data?.health_score || 0,
                totalCoverage: policies.reduce((s, p) => s + (p.coverage_amount || 0), 0),
                totalAssets: accounts.reduce((s, a) => s + (a.current_value || 0), 0),
                activePolicies: policies.filter(p => p.status === 'active').length,
                upcomingAppointments: appointmentsRes.data || [],
                unreadMessages: messagesRes.count || 0,
                recentDocuments: docsRes.data || [],
            })
        } catch (err) {
            setError('Failed to load dashboard.')
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    const firstName = user?.user_metadata?.first_name || data?.clientProfile?.first_name || 'there'

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" /></div>
    if (error) return <div className="flex items-center justify-center min-h-[400px]"><div className="text-center space-y-3"><p className="text-[#4A5565]">{error}</p><button onClick={() => { setError(null); setLoading(true); loadDashboard() }} className="px-4 py-2 bg-[#1A4D3E] text-white text-sm font-medium">Retry</button></div></div>

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 border border-[#4A5565]/10 shadow-sm">
                    <h1 className="text-2xl font-bold text-[#1A4D3E]">Welcome back, {firstName}</h1>
                    <p className="text-[#4A5565] mt-1">Here&apos;s an overview of your financial portfolio</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <StatCard label="Total Coverage" value={formatCurrency(data?.totalCoverage || 0)} icon={<Shield className="h-5 w-5" />} />
                        <StatCard label="Total Assets" value={formatCurrency(data?.totalAssets || 0)} icon={<Wallet className="h-5 w-5" />} />
                        <StatCard label="Active Policies" value={String(data?.activePolicies || 0)} icon={<FileText className="h-5 w-5" />} />
                    </div>
                </div>
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Financial Health</h3>
                    <FinancialHealthGauge score={data?.healthScore || 0} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdvisorCard advisor={data?.advisor || null} />
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/portal/coverage" className="flex items-center gap-3 p-4 bg-[#f0f2f1] hover:bg-[#1A4D3E]/5 transition-colors">
                            <Shield className="h-5 w-5 text-[#1A4D3E]" />
                            <span className="text-sm font-medium text-[#1A4D3E]">View Coverage</span>
                        </Link>
                        <Link href="/portal/accounts" className="flex items-center gap-3 p-4 bg-[#f0f2f1] hover:bg-[#1A4D3E]/5 transition-colors">
                            <Wallet className="h-5 w-5 text-[#1A4D3E]" />
                            <span className="text-sm font-medium text-[#1A4D3E]">My Accounts</span>
                        </Link>
                        <Link href="/portal/documents" className="flex items-center gap-3 p-4 bg-[#f0f2f1] hover:bg-[#1A4D3E]/5 transition-colors">
                            <FileText className="h-5 w-5 text-[#1A4D3E]" />
                            <span className="text-sm font-medium text-[#1A4D3E]">Documents</span>
                        </Link>
                        <Link href="/portal/messages" className="flex items-center gap-3 p-4 bg-[#f0f2f1] hover:bg-[#1A4D3E]/5 transition-colors relative">
                            <MessageSquare className="h-5 w-5 text-[#1A4D3E]" />
                            <span className="text-sm font-medium text-[#1A4D3E]">Messages</span>
                            {(data?.unreadMessages || 0) > 0 && <span className="absolute top-2 right-2 bg-[#1A4D3E] text-white text-xs font-bold px-1.5 py-0.5">{data!.unreadMessages}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider">Upcoming Appointments</h3>
                    <Link href="/portal/appointments" className="text-sm text-[#1A4D3E] hover:text-[#1A4D3E]/80 font-medium">View all</Link>
                </div>
                {(data?.upcomingAppointments?.length || 0) === 0 ? (
                    <p className="text-sm text-[#4A5565] py-4">No upcoming appointments</p>
                ) : (
                    <div className="space-y-3">
                        {data!.upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-4 bg-[#f0f2f1]">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-[#1A4D3E]" />
                                    <div>
                                        <p className="text-sm font-medium text-[#1A4D3E] capitalize">{(apt.type || 'appointment').replace('-', ' ')}</p>
                                        <p className="text-xs text-[#4A5565]">{formatDate(apt.scheduled_at)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-[#4A5565] capitalize">{apt.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
