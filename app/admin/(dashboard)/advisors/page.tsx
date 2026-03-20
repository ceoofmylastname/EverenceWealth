'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Plus, Search, Users, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Advisor {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    status: string
    specialties: string[] | null
    territories: string[] | null
    license_number: string | null
    created_at: string
    metrics: { leads_claimed?: number; clients_active?: number; revenue_ytd?: number } | null
    _clientCount?: number
    _leadCount?: number
}

export default function AdminAdvisorsPage() {
    const [advisors, setAdvisors] = useState<Advisor[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadAdvisors()
    }, [])

    async function loadAdvisors() {
        try {
            const supabase = createClient()

            const { data: advisorData } = await supabase
                .from('advisors')
                .select('*')
                .order('created_at', { ascending: false })

            if (!advisorData) {
                setLoading(false)
                return
            }

            // Get counts for each advisor
            const advisorsWithCounts = await Promise.all(
                advisorData.map(async (advisor) => {
                    const [clientsRes, leadsRes] = await Promise.all([
                        supabase.from('clients').select('id', { count: 'exact' }).eq('advisor_id', advisor.id),
                        supabase.from('leads').select('id', { count: 'exact' }).eq('assigned_advisor_id', advisor.id),
                    ])
                    return {
                        ...advisor,
                        _clientCount: clientsRes.count || 0,
                        _leadCount: leadsRes.count || 0,
                    }
                })
            )

            setAdvisors(advisorsWithCounts)
        } catch (err) {
            console.error('Advisors load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function toggleStatus(advisorId: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        const supabase = createClient()
        const { error } = await supabase.from('advisors').update({ status: newStatus }).eq('id', advisorId)

        if (error) {
            toast.error('Failed to update status')
            return
        }

        setAdvisors(prev => prev.map(a => a.id === advisorId ? { ...a, status: newStatus } : a))
        toast.success(`Advisor ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    }

    const filtered = advisors.filter(a => {
        if (statusFilter !== 'all' && a.status !== statusFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return (
                a.first_name.toLowerCase().includes(q) ||
                a.last_name.toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q)
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
                    <h1 className="text-2xl font-bold text-white">Advisors</h1>
                    <p className="text-gray-400 mt-1">{advisors.length} total advisors</p>
                </div>
                <Link
                    href="/admin/advisors/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Advisor
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-brand-gold" />
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{advisors.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="h-5 w-5 text-green-400" />
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{advisors.filter(a => a.status === 'active').length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <UserX className="h-5 w-5 text-gray-400" />
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Inactive</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{advisors.filter(a => a.status !== 'active').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search advisors..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Advisor</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Clients</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Leads</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Specialties</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 py-8">No advisors found</td>
                            </tr>
                        ) : (
                            filtered.map((advisor) => (
                                <tr key={advisor.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/advisors/${advisor.id}`} className="text-sm font-medium text-white hover:text-brand-gold">
                                            {advisor.first_name} {advisor.last_name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{advisor.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                                            advisor.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {advisor.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-400">{advisor._clientCount}</td>
                                    <td className="px-4 py-3 text-sm text-gray-400">{advisor._leadCount}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 flex-wrap">
                                            {(advisor.specialties || []).slice(0, 2).map(s => (
                                                <span key={s} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => toggleStatus(advisor.id, advisor.status)}
                                            className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                                                advisor.status === 'active'
                                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                            }`}
                                        >
                                            {advisor.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
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
