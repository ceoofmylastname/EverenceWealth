'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, GraduationCap, Users, Calendar, ExternalLink } from 'lucide-react'

interface Workshop {
    id: string
    title: string
    description: string | null
    scheduled_at: string
    duration_minutes: number
    max_attendees: number
    current_attendees: number
    meeting_url: string | null
    status: string
    recording_url: string | null
    created_at: string
}

interface Registration {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    attended: boolean
    created_at: string
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400',
    live: 'bg-green-500/20 text-green-400',
    completed: 'bg-gray-500/20 text-gray-300',
    cancelled: 'bg-red-500/20 text-red-400',
}

export default function AgentWorkshopsPage() {
    const { user } = useAuth()
    const [workshops, setWorkshops] = useState<Workshop[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loadingRegs, setLoadingRegs] = useState(false)

    useEffect(() => {
        if (!user) return
        loadWorkshops()
    }, [user])

    async function loadWorkshops() {
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
                .from('workshops')
                .select('*')
                .eq('instructor_advisor_id', advisor.id)
                .order('scheduled_at', { ascending: false })

            setWorkshops(data || [])
        } catch (err) {
            console.error('Workshops load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function loadRegistrations(workshopId: string) {
        setLoadingRegs(true)
        setSelectedWorkshop(workshopId)
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('workshop_registrations')
                .select('*')
                .eq('workshop_id', workshopId)
                .order('created_at', { ascending: false })

            setRegistrations(data || [])
        } catch (err) {
            console.error('Registrations load error:', err)
        } finally {
            setLoadingRegs(false)
        }
    }

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
            <div>
                <h1 className="text-2xl font-bold text-white">Workshops</h1>
                <p className="text-gray-400 mt-1">Your scheduled workshops and registrations</p>
            </div>

            {workshops.length === 0 ? (
                <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center">
                    <GraduationCap className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-500">No workshops assigned to you</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {workshops.map(workshop => (
                        <div key={workshop.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <div className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-brand-gold/10 flex items-center justify-center rounded-lg flex-shrink-0">
                                        <GraduationCap className="h-5 w-5 text-brand-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{workshop.title}</h3>
                                        {workshop.description && <p className="text-xs text-gray-500 mt-1">{workshop.description}</p>}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(workshop.scheduled_at)}</span>
                                            <span>{workshop.duration_minutes} min</span>
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {workshop.current_attendees}/{workshop.max_attendees}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[workshop.status] || ''}`}>
                                        {workshop.status}
                                    </span>
                                    {workshop.meeting_url && (
                                        <a href={workshop.meeting_url} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-brand-gold/80">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Registrations toggle */}
                            <div className="border-t border-white/10 px-5 py-3">
                                <button
                                    onClick={() => selectedWorkshop === workshop.id ? setSelectedWorkshop(null) : loadRegistrations(workshop.id)}
                                    className="text-xs text-brand-gold hover:text-brand-gold/80 font-medium"
                                >
                                    {selectedWorkshop === workshop.id ? 'Hide Registrations' : 'View Registrations'}
                                </button>

                                {selectedWorkshop === workshop.id && (
                                    <div className="mt-3">
                                        {loadingRegs ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                                        ) : registrations.length === 0 ? (
                                            <p className="text-xs text-gray-500">No registrations yet</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {registrations.map(reg => (
                                                    <div key={reg.id} className="flex items-center justify-between py-2 text-xs">
                                                        <div>
                                                            <span className="text-white font-medium">{reg.first_name} {reg.last_name}</span>
                                                            <span className="text-gray-500 ml-2">{reg.email}</span>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded ${reg.attended ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                            {reg.attended ? 'Attended' : 'Registered'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
