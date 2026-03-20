'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, ArrowLeft, Shield, Wallet, FileText, Calendar, MessageSquare, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

interface ClientDetail {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    status: string
    total_assets: number | null
    annual_income: number | null
    risk_tolerance: string | null
    onboarding_completed: boolean
    date_of_birth: string | null
    address: any
    created_at: string
}

export default function AgentClientDetailPage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const [client, setClient] = useState<ClientDetail | null>(null)
    const [policies, setPolicies] = useState<any[]>([])
    const [accounts, setAccounts] = useState<any[]>([])
    const [appointments, setAppointments] = useState<any[]>([])
    const [healthScore, setHealthScore] = useState<number>(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadClient()
    }, [user, params.id])

    async function loadClient() {
        try {
            const supabase = createClient()

            const { data: clientData } = await supabase
                .from('clients')
                .select('*')
                .eq('id', params.id)
                .single()

            if (!clientData) {
                setLoading(false)
                return
            }

            setClient(clientData)

            const [policiesRes, accountsRes, appointmentsRes, healthRes] = await Promise.all([
                supabase.from('policies').select('*').eq('client_id', params.id).order('created_at', { ascending: false }),
                supabase.from('accounts').select('*').eq('client_id', params.id).order('created_at', { ascending: false }),
                supabase.from('appointments').select('*').eq('client_id', params.id).order('scheduled_at', { ascending: false }).limit(5),
                supabase.from('financial_health').select('health_score').eq('client_id', params.id).single(),
            ])

            setPolicies(policiesRes.data || [])
            setAccounts(accountsRes.data || [])
            setAppointments(appointmentsRes.data || [])
            setHealthScore(healthRes.data?.health_score || 0)
        } catch (err) {
            console.error('Client detail load error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    if (!client) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Client not found</p>
                <Link href="/agent/clients" className="text-brand-gold hover:underline text-sm mt-2 inline-block">
                    Back to clients
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Link href="/agent/clients" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                <ArrowLeft className="h-4 w-4" /> Back to clients
            </Link>

            {/* Client Header */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{client.first_name} {client.last_name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>
                            {client.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>}
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded ${
                        client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {client.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Total Assets</p>
                        <p className="text-lg font-bold text-white">{client.total_assets ? formatCurrency(client.total_assets) : '—'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Annual Income</p>
                        <p className="text-lg font-bold text-white">{client.annual_income ? formatCurrency(client.annual_income) : '—'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Risk Tolerance</p>
                        <p className="text-lg font-bold text-white capitalize">{client.risk_tolerance || '—'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Health Score</p>
                        <p className="text-lg font-bold text-white">{healthScore}/100</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Policies */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Policies ({policies.length})
                    </h3>
                    {policies.length === 0 ? (
                        <p className="text-sm text-gray-500">No policies</p>
                    ) : (
                        <div className="space-y-2">
                            {policies.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize">{p.policy_type?.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500">#{p.policy_number || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white">{p.coverage_amount ? formatCurrency(p.coverage_amount) : '—'}</p>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>{p.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Accounts */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Accounts ({accounts.length})
                    </h3>
                    {accounts.length === 0 ? (
                        <p className="text-sm text-gray-500">No accounts</p>
                    ) : (
                        <div className="space-y-2">
                            {accounts.map(a => (
                                <div key={a.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize">{a.account_type?.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500">{a.account_number || 'N/A'}</p>
                                    </div>
                                    <p className="text-sm font-medium text-white">{a.current_value ? formatCurrency(a.current_value) : '—'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Recent Appointments
                </h3>
                {appointments.length === 0 ? (
                    <p className="text-sm text-gray-500">No appointments</p>
                ) : (
                    <div className="space-y-2">
                        {appointments.map(apt => (
                            <div key={apt.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-white capitalize">{apt.type?.replace('-', ' ')}</p>
                                    <p className="text-xs text-gray-500">{formatDate(apt.scheduled_at)}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    apt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    apt.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-gray-500/20 text-gray-400'
                                }`}>{apt.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
