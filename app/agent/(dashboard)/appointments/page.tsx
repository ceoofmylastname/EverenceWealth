'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Plus, X, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

interface Appointment {
    id: string
    type: string
    status: string
    scheduled_at: string
    duration_minutes: number
    meeting_url: string | null
    notes: string | null
    client_id: string
    clients?: { first_name: string; last_name: string } | null
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400',
    confirmed: 'bg-green-500/20 text-green-400',
    completed: 'bg-gray-500/20 text-gray-300',
    cancelled: 'bg-red-500/20 text-red-400',
    'no-show': 'bg-yellow-500/20 text-yellow-400',
}

export default function AgentAppointmentsPage() {
    const { user } = useAuth()
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
    const [newApt, setNewApt] = useState({ client_id: '', type: 'fna', scheduled_at: '', duration_minutes: '60', notes: '' })
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        if (!user) return
        loadAppointments()
    }, [user])

    async function loadAppointments() {
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

            const [aptsRes, clientsRes] = await Promise.all([
                supabase.from('appointments').select('*, clients(first_name, last_name)').eq('advisor_id', advisor.id).order('scheduled_at', { ascending: false }),
                supabase.from('clients').select('id, first_name, last_name').eq('advisor_id', advisor.id).eq('status', 'active'),
            ])

            setAppointments(aptsRes.data || [])
            setClients(clientsRes.data || [])
        } catch (err) {
            console.error('Appointments load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function createAppointment() {
        if (!advisorId || !newApt.client_id || !newApt.scheduled_at) return
        setCreating(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('appointments')
                .insert({
                    advisor_id: advisorId,
                    client_id: newApt.client_id,
                    type: newApt.type,
                    scheduled_at: new Date(newApt.scheduled_at).toISOString(),
                    duration_minutes: parseInt(newApt.duration_minutes) || 60,
                    notes: newApt.notes.trim() || null,
                })
                .select('*, clients(first_name, last_name)')
                .single()

            if (error) throw error

            setAppointments(prev => [data, ...prev])
            setNewApt({ client_id: '', type: 'fna', scheduled_at: '', duration_minutes: '60', notes: '' })
            setShowCreate(false)
            toast.success('Appointment created')
        } catch {
            toast.error('Failed to create appointment')
        } finally {
            setCreating(false)
        }
    }

    async function updateStatus(aptId: string, newStatus: string) {
        const supabase = createClient()
        const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', aptId)
        if (error) {
            toast.error('Failed to update')
            return
        }
        setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a))
        toast.success('Updated')
    }

    const now = new Date().toISOString()
    const filtered = appointments.filter(a => {
        if (tab === 'upcoming') return a.scheduled_at >= now && a.status !== 'cancelled'
        return a.scheduled_at < now || a.status === 'cancelled'
    })

    const formatDateTime = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

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
                    <h1 className="text-2xl font-bold text-white">Appointments</h1>
                    <p className="text-gray-400 mt-1">Schedule and manage client meetings</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors"
                >
                    <Plus className="h-4 w-4" /> New Appointment
                </button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">New Appointment</h3>
                        <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={newApt.client_id}
                            onChange={(e) => setNewApt(prev => ({ ...prev, client_id: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        >
                            <option value="">Select client</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                            ))}
                        </select>
                        <select
                            value={newApt.type}
                            onChange={(e) => setNewApt(prev => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        >
                            <option value="fna">Financial Needs Assessment</option>
                            <option value="review">Portfolio Review</option>
                            <option value="follow-up">Follow-up</option>
                            <option value="onboarding">Onboarding</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="datetime-local"
                            value={newApt.scheduled_at}
                            onChange={(e) => setNewApt(prev => ({ ...prev, scheduled_at: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                        <select
                            value={newApt.duration_minutes}
                            onChange={(e) => setNewApt(prev => ({ ...prev, duration_minutes: e.target.value }))}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        >
                            <option value="30">30 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                        </select>
                    </div>
                    <textarea
                        value={newApt.notes}
                        onChange={(e) => setNewApt(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Notes (optional)"
                        rows={2}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold resize-none"
                    />
                    <button
                        onClick={createAppointment}
                        disabled={creating || !newApt.client_id || !newApt.scheduled_at}
                        className="px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Appointment'}
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setTab('upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'upcoming' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setTab('past')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'past' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Past
                </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center">
                        <p className="text-gray-500">No {tab} appointments</p>
                    </div>
                ) : (
                    filtered.map(apt => (
                        <div key={apt.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-brand-gold/10 flex items-center justify-center rounded-lg">
                                    <Calendar className="h-5 w-5 text-brand-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white capitalize">
                                        {apt.type.replace('-', ' ')}
                                        {apt.clients && ` — ${apt.clients.first_name} ${apt.clients.last_name}`}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatDateTime(apt.scheduled_at)} ({apt.duration_minutes} min)</p>
                                    {apt.notes && <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {tab === 'upcoming' ? (
                                    <select
                                        value={apt.status}
                                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                                        className={`text-xs font-medium px-2 py-1 rounded border-0 ${statusColors[apt.status] || ''}`}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no-show">No Show</option>
                                    </select>
                                ) : (
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[apt.status] || ''}`}>
                                        {apt.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
