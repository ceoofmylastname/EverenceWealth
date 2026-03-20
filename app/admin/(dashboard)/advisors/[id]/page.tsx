'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowLeft, Users, UserPlus, Mail, Phone, MapPin, Award } from 'lucide-react'
import Link from 'next/link'

interface AdvisorDetail {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    bio: string | null
    photo_url: string | null
    license_number: string | null
    specialties: string[] | null
    territories: string[] | null
    calendar_url: string | null
    status: string
    metrics: any
    created_at: string
}

export default function AdminAdvisorDetailPage({ params }: { params: { id: string } }) {
    const [advisor, setAdvisor] = useState<AdvisorDetail | null>(null)
    const [clients, setClients] = useState<any[]>([])
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAdvisor()
    }, [params.id])

    async function loadAdvisor() {
        try {
            const supabase = createClient()

            const { data: advisorData } = await supabase
                .from('advisors')
                .select('*')
                .eq('id', params.id)
                .single()

            if (!advisorData) {
                setLoading(false)
                return
            }

            setAdvisor(advisorData)

            const [clientsRes, leadsRes] = await Promise.all([
                supabase.from('clients').select('id, first_name, last_name, email, status, total_assets, created_at').eq('advisor_id', params.id).order('created_at', { ascending: false }),
                supabase.from('leads').select('id, first_name, last_name, email, status, interest_level, created_at').eq('assigned_advisor_id', params.id).order('created_at', { ascending: false }),
            ])

            setClients(clientsRes.data || [])
            setLeads(leadsRes.data || [])
        } catch (err) {
            console.error('Advisor load error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    if (!advisor) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Advisor not found</p>
                <Link href="/admin/advisors" className="text-brand-gold hover:underline text-sm mt-2 inline-block">
                    Back to advisors
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Link href="/admin/advisors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                <ArrowLeft className="h-4 w-4" /> Back to advisors
            </Link>

            {/* Advisor Header */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        {advisor.photo_url ? (
                            <img src={advisor.photo_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                            <div className="h-16 w-16 bg-brand-gold/20 flex items-center justify-center rounded-lg text-brand-gold text-xl font-bold">
                                {advisor.first_name[0]}{advisor.last_name[0]}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-white">{advisor.first_name} {advisor.last_name}</h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {advisor.email}</span>
                                {advisor.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {advisor.phone}</span>}
                            </div>
                            {advisor.bio && <p className="text-sm text-gray-400 mt-2 max-w-xl">{advisor.bio}</p>}
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded ${
                        advisor.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                        {advisor.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Clients</p>
                        <p className="text-lg font-bold text-white">{clients.length}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Leads</p>
                        <p className="text-lg font-bold text-white">{leads.length}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Total AUM</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(clients.reduce((s, c) => s + (c.total_assets || 0), 0))}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">License</p>
                        <p className="text-lg font-bold text-white">{advisor.license_number || '—'}</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {(advisor.specialties || []).length > 0 && (
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            <div className="flex gap-1 flex-wrap">
                                {advisor.specialties!.map(s => (
                                    <span key={s} className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {(advisor.territories || []).length > 0 && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <div className="flex gap-1 flex-wrap">
                                {advisor.territories!.map(t => (
                                    <span key={t} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clients */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4" /> Clients ({clients.length})
                    </h3>
                    {clients.length === 0 ? (
                        <p className="text-sm text-gray-500">No clients assigned</p>
                    ) : (
                        <div className="space-y-2">
                            {clients.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">{c.first_name} {c.last_name}</p>
                                        <p className="text-xs text-gray-500">{c.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">{c.total_assets ? formatCurrency(c.total_assets) : '—'}</p>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>{c.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Leads */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Leads ({leads.length})
                    </h3>
                    {leads.length === 0 ? (
                        <p className="text-sm text-gray-500">No leads assigned</p>
                    ) : (
                        <div className="space-y-2">
                            {leads.map(l => (
                                <div key={l.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">{l.first_name} {l.last_name}</p>
                                        <p className="text-xs text-gray-500">{l.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {l.interest_level && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                l.interest_level === 'hot' ? 'bg-red-500/20 text-red-400' :
                                                l.interest_level === 'warm' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>{l.interest_level}</span>
                                        )}
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            l.status === 'converted' ? 'bg-purple-500/20 text-purple-400' :
                                            l.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>{l.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
