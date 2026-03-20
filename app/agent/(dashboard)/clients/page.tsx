'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Search, Users, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

interface Client {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    status: string
    total_assets: number | null
    onboarding_completed: boolean
    created_at: string
}

export default function AgentClientsPage() {
    const { user } = useAuth()
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        if (!user) return
        loadClients()
    }, [user])

    async function loadClients() {
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

            const { data } = await supabase
                .from('clients')
                .select('*')
                .eq('advisor_id', advisor.id)
                .order('created_at', { ascending: false })

            setClients(data || [])
        } catch (err) {
            console.error('Clients load error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const filteredClients = clients.filter(c => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return (
                c.first_name.toLowerCase().includes(q) ||
                c.last_name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
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
                    <h1 className="text-2xl font-bold text-white">Clients</h1>
                    <p className="text-gray-400 mt-1">{clients.length} total clients</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{clients.filter(c => c.status === 'active').length}</p>
                    <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{clients.filter(c => !c.onboarding_completed).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Onboarding</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">
                        {formatCurrency(clients.reduce((s, c) => s + (c.total_assets || 0), 0))}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total AUM</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clients..."
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
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Clients Table */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Client</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Assets</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Onboarding</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-8">No clients found</td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr key={client.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <Link href={`/agent/clients/${client.id}`} className="text-sm font-medium text-white hover:text-brand-gold">
                                            {client.first_name} {client.last_name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Mail className="h-3 w-3" /> {client.email}
                                        </div>
                                        {client.phone && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <Phone className="h-3 w-3" /> {client.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                                            client.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                            client.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                        {client.total_assets ? formatCurrency(client.total_assets) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                                            client.onboarding_completed ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                        }`}>
                                            {client.onboarding_completed ? 'Complete' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {new Date(client.created_at).toLocaleDateString()}
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
