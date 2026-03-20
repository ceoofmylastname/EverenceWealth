'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, UserPlus, Phone, Mail, ArrowRight, Search } from 'lucide-react'
import toast from 'react-hot-toast'

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted'

interface Lead {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    status: string
    interest_level: string | null
    source_type: string | null
    primary_concern: string | null
    created_at: string
    claimed_at: string | null
    assigned_advisor_id: string | null
    notes: any
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    contacted: 'bg-yellow-500/20 text-yellow-400',
    qualified: 'bg-green-500/20 text-green-400',
    converted: 'bg-purple-500/20 text-purple-400',
}

const interestColors: Record<string, string> = {
    hot: 'bg-red-500/20 text-red-400',
    warm: 'bg-orange-500/20 text-orange-400',
    cold: 'bg-blue-500/20 text-blue-400',
}

export default function AgentLeadsPage() {
    const { user, session } = useAuth()
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [assignedLeads, setAssignedLeads] = useState<Lead[]>([])
    const [unclaimedLeads, setUnclaimedLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [claiming, setClaiming] = useState<string | null>(null)
    const [filter, setFilter] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [tab, setTab] = useState<'mine' | 'unclaimed'>('mine')

    useEffect(() => {
        if (!user) return
        loadLeads()
    }, [user])

    async function loadLeads() {
        try {
            const supabase = createClient()

            const { data: advisor } = await supabase
                .from('advisors')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!advisor) {
                setLoading(false)
                return
            }

            setAdvisorId(advisor.id)

            // Fetch assigned leads (RLS allows this)
            const { data: myLeads } = await supabase
                .from('leads')
                .select('*')
                .eq('assigned_advisor_id', advisor.id)
                .order('created_at', { ascending: false })

            setAssignedLeads(myLeads || [])

            // Fetch unclaimed leads via API (RLS blocks reading unassigned leads)
            if (session?.access_token) {
                const res = await fetch('/api/agent/leads', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                })
                if (res.ok) {
                    const data = await res.json()
                    setUnclaimedLeads(data.leads || [])
                }
            }
        } catch (err) {
            console.error('Leads load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function claimLead(leadId: string) {
        if (!session?.access_token) return
        setClaiming(leadId)
        try {
            const res = await fetch('/api/agent/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ lead_id: leadId }),
            })
            if (res.ok) {
                const { lead } = await res.json()
                toast.success(`Claimed ${lead.first_name} ${lead.last_name}`)
                setUnclaimedLeads(prev => prev.filter(l => l.id !== leadId))
                setAssignedLeads(prev => [lead, ...prev])
            } else {
                const err = await res.json()
                toast.error(err.error || 'Failed to claim lead')
            }
        } catch {
            toast.error('Failed to claim lead')
        } finally {
            setClaiming(null)
        }
    }

    async function updateLeadStatus(leadId: string, newStatus: string) {
        const supabase = createClient()
        const updates: any = { status: newStatus }
        if (newStatus === 'contacted') updates.contacted_at = new Date().toISOString()
        if (newStatus === 'qualified') updates.qualified_at = new Date().toISOString()

        const { error } = await supabase
            .from('leads')
            .update(updates)
            .eq('id', leadId)

        if (error) {
            toast.error('Failed to update status')
            return
        }

        setAssignedLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l))
        toast.success('Status updated')
    }

    async function convertLead(leadId: string) {
        if (!session?.access_token) return
        setClaiming(leadId)
        try {
            const res = await fetch(`/api/agent/leads/${leadId}/convert`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${session.access_token}` },
            })
            if (res.ok) {
                toast.success('Lead converted to client')
                setAssignedLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'converted' } : l))
            } else {
                const err = await res.json()
                toast.error(err.error || 'Failed to convert lead')
            }
        } catch {
            toast.error('Failed to convert lead')
        } finally {
            setClaiming(null)
        }
    }

    const filteredLeads = (tab === 'mine' ? assignedLeads : unclaimedLeads).filter(lead => {
        if (filter !== 'all' && lead.status !== filter) return false
        if (search) {
            const q = search.toLowerCase()
            return (
                lead.first_name.toLowerCase().includes(q) ||
                lead.last_name.toLowerCase().includes(q) ||
                lead.email.toLowerCase().includes(q)
            )
        }
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leads</h1>
                    <p className="text-gray-400 mt-1">Manage and track your lead pipeline</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setTab('mine')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'mine' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    My Leads ({assignedLeads.length})
                </button>
                <button
                    onClick={() => setTab('unclaimed')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'unclaimed' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Unclaimed ({unclaimedLeads.length})
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search leads..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                    />
                </div>
                {tab === 'mine' && (
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                    </select>
                )}
            </div>

            {/* Pipeline Stats (My Leads only) */}
            {tab === 'mine' && (
                <div className="grid grid-cols-4 gap-3">
                    {(['new', 'contacted', 'qualified', 'converted'] as const).map(status => (
                        <div key={status} className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                            <p className="text-2xl font-bold text-white">{assignedLeads.filter(l => l.status === status).length}</p>
                            <p className="text-xs text-gray-500 capitalize mt-1">{status}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Leads Table */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Interest</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-8">
                                    {tab === 'unclaimed' ? 'No unclaimed leads available' : 'No leads found'}
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead) => (
                                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-white">{lead.first_name} {lead.last_name}</p>
                                        {lead.primary_concern && (
                                            <p className="text-xs text-gray-500">{lead.primary_concern}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Mail className="h-3 w-3" /> {lead.email}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <Phone className="h-3 w-3" /> {lead.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {tab === 'mine' ? (
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                disabled={lead.status === 'converted'}
                                                className={`text-xs font-medium px-2 py-1 rounded border-0 ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400'}`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="qualified">Qualified</option>
                                                <option value="converted">Converted</option>
                                            </select>
                                        ) : (
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {lead.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {lead.interest_level && (
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${interestColors[lead.interest_level] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {lead.interest_level}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {tab === 'unclaimed' ? (
                                            <button
                                                onClick={() => claimLead(lead.id)}
                                                disabled={claiming === lead.id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-gold text-black text-xs font-medium rounded hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                                            >
                                                {claiming === lead.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
                                                Claim
                                            </button>
                                        ) : lead.status === 'qualified' ? (
                                            <button
                                                onClick={() => convertLead(lead.id)}
                                                disabled={claiming === lead.id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                {claiming === lead.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                                                Convert
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
