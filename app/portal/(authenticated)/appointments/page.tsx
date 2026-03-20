'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Calendar, Clock, Video, X, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const typeLabels: Record<string, string> = {
    fna: 'Financial Needs Assessment',
    review: 'Annual Review',
    'follow-up': 'Follow-up',
    onboarding: 'Onboarding',
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-50 text-blue-700',
    confirmed: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-gray-50 text-gray-700',
    cancelled: 'bg-red-50 text-red-700',
    'no-show': 'bg-amber-50 text-amber-700',
}

export default function AppointmentsPage() {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [clientId, setClientId] = useState<string | null>(null)
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [showSchedule, setShowSchedule] = useState(false)
    const [scheduling, setScheduling] = useState(false)
    const [newAppt, setNewAppt] = useState({ type: 'follow-up', date: '', time: '', notes: '' })

    useEffect(() => {
        if (!user) return
        loadAppointments()
    }, [user])

    async function loadAppointments() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id, advisor_id')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }
            setClientId(client.id)
            setAdvisorId(client.advisor_id)

            const { data } = await supabase
                .from('appointments')
                .select('*')
                .eq('client_id', client.id)
                .order('scheduled_at', { ascending: false })

            setAppointments(data || [])
        } catch (err) {
            console.error('Failed to load appointments:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSchedule(e: React.FormEvent) {
        e.preventDefault()
        if (!clientId || !advisorId || !newAppt.date || !newAppt.time) return

        setScheduling(true)
        try {
            const supabase = createClient()
            const scheduledAt = new Date(`${newAppt.date}T${newAppt.time}`).toISOString()

            const { error } = await supabase
                .from('appointments')
                .insert({
                    client_id: clientId,
                    advisor_id: advisorId,
                    type: newAppt.type as any,
                    scheduled_at: scheduledAt,
                    notes: newAppt.notes || null,
                    duration_minutes: 60,
                })

            if (error) throw error

            toast.success('Appointment requested')
            setShowSchedule(false)
            setNewAppt({ type: 'follow-up', date: '', time: '', notes: '' })
            loadAppointments()
        } catch (err: any) {
            toast.error(err?.message || 'Failed to schedule appointment')
        } finally {
            setScheduling(false)
        }
    }

    async function handleCancel(id: string) {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', id)

            if (error) throw error
            toast.success('Appointment cancelled')
            loadAppointments()
        } catch (err: any) {
            toast.error(err?.message || 'Failed to cancel')
        }
    }

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

    const formatTime = (d: string) =>
        new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    const now = new Date()
    const upcoming = appointments.filter(a => new Date(a.scheduled_at) >= now && a.status !== 'cancelled')
    const past = appointments.filter(a => new Date(a.scheduled_at) < now || a.status === 'cancelled')

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A4D3E]">Appointments</h1>
                    <p className="text-[#4A5565] text-sm mt-1">Schedule and manage your meetings</p>
                </div>
                <button
                    onClick={() => setShowSchedule(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Schedule
                </button>
            </div>

            {/* Schedule modal */}
            {showSchedule && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-[#1A4D3E]">Schedule Appointment</h3>
                            <button onClick={() => setShowSchedule(false)} className="text-[#4A5565] hover:text-[#1A4D3E]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSchedule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4A5565] mb-1">Type</label>
                                <select
                                    value={newAppt.type}
                                    onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] focus:outline-none focus:border-[#1A4D3E]"
                                >
                                    {Object.entries(typeLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#4A5565] mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={newAppt.date}
                                        onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] focus:outline-none focus:border-[#1A4D3E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4A5565] mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={newAppt.time}
                                        onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] focus:outline-none focus:border-[#1A4D3E]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4A5565] mb-1">Notes (optional)</label>
                                <textarea
                                    value={newAppt.notes}
                                    onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                                    rows={3}
                                    placeholder="What would you like to discuss?"
                                    className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={scheduling}
                                className="w-full py-3 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {scheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                                {scheduling ? 'Scheduling...' : 'Request Appointment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Upcoming */}
            <div>
                <h2 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Upcoming</h2>
                {upcoming.length === 0 ? (
                    <div className="bg-white p-8 border border-[#4A5565]/10 shadow-sm text-center">
                        <Calendar className="h-8 w-8 text-[#4A5565]/30 mx-auto mb-2" />
                        <p className="text-sm text-[#4A5565]">No upcoming appointments</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map((apt) => (
                            <div key={apt.id} className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#1A4D3E]/5">
                                            <Calendar className="h-5 w-5 text-[#1A4D3E]" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1A4D3E]">
                                                {typeLabels[apt.type] || apt.type}
                                            </p>
                                            <p className="text-sm text-[#4A5565] mt-1">
                                                {formatDate(apt.scheduled_at)}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-[#4A5565]">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(apt.scheduled_at)} ({apt.duration_minutes} min)
                                                </span>
                                                {apt.meeting_url && (
                                                    <a
                                                        href={apt.meeting_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[#1A4D3E] hover:text-[#1A4D3E]/80"
                                                    >
                                                        <Video className="h-3 w-3" />
                                                        Join meeting
                                                    </a>
                                                )}
                                            </div>
                                            {apt.notes && (
                                                <p className="text-sm text-[#4A5565] mt-2 bg-[#f0f2f1] p-2">{apt.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={clsx('text-xs font-medium px-2 py-1 capitalize', statusColors[apt.status] || 'bg-gray-50 text-gray-700')}>
                                            {apt.status}
                                        </span>
                                        <button
                                            onClick={() => handleCancel(apt.id)}
                                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past */}
            {past.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Past</h2>
                    <div className="bg-white border border-[#4A5565]/10 shadow-sm divide-y divide-[#4A5565]/10">
                        {past.map((apt) => (
                            <div key={apt.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#1A4D3E]">
                                        {typeLabels[apt.type] || apt.type}
                                    </p>
                                    <p className="text-xs text-[#4A5565]">
                                        {formatDate(apt.scheduled_at)} at {formatTime(apt.scheduled_at)}
                                    </p>
                                </div>
                                <span className={clsx('text-xs font-medium px-2 py-1 capitalize', statusColors[apt.status] || 'bg-gray-50 text-gray-700')}>
                                    {apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
