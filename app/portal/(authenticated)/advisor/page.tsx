'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Mail, Phone, Calendar, User, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AdvisorPage() {
    const { user } = useAuth()
    const [advisor, setAdvisor] = useState<any>(null)
    const [pastAppointments, setPastAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadAdvisor()
    }, [user])

    async function loadAdvisor() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id, advisor_id')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }

            // Fetch advisor via public API (bypasses RLS)
            if (client.advisor_id) {
                try {
                    const res = await fetch('/api/advisors/public')
                    const json = await res.json()
                    const advisors = json.advisors || []
                    setAdvisor(advisors.find((a: any) => a.id === client.advisor_id) || null)
                } catch {
                    // Non-critical
                }
            }

            if (client.id) {
                const { data: appointments } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('client_id', client.id)
                    .order('scheduled_at', { ascending: false })
                    .limit(10)

                setPastAppointments(appointments || [])
            }
        } catch (err) {
            console.error('Failed to load advisor:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    if (!advisor) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-[#1A4D3E]">My Advisor</h1>
                <div className="bg-white p-12 border border-[#4A5565]/10 shadow-sm text-center">
                    <User className="h-12 w-12 text-[#4A5565]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1A4D3E]">No advisor assigned</h3>
                    <p className="text-sm text-[#4A5565] mt-1">Please contact support to be matched with an advisor.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#1A4D3E]">My Advisor</h1>

            {/* Advisor Profile */}
            <div className="bg-white p-8 border border-[#4A5565]/10 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    {advisor.photo_url ? (
                        <img
                            src={advisor.photo_url}
                            alt={`${advisor.first_name} ${advisor.last_name}`}
                            className="w-24 h-24 object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-[#1A4D3E]/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-10 w-10 text-[#1A4D3E]" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-[#1A4D3E]">
                            {advisor.first_name} {advisor.last_name}
                        </h2>
                        {advisor.bio && (
                            <p className="text-sm text-[#4A5565] mt-2 leading-relaxed">{advisor.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-4 mt-4">
                            <a
                                href={`mailto:${advisor.email}`}
                                className="flex items-center gap-2 text-sm text-[#4A5565] hover:text-[#1A4D3E]"
                            >
                                <Mail className="h-4 w-4" />
                                {advisor.email}
                            </a>
                            {advisor.phone && (
                                <a
                                    href={`tel:${advisor.phone}`}
                                    className="flex items-center gap-2 text-sm text-[#4A5565] hover:text-[#1A4D3E]"
                                >
                                    <Phone className="h-4 w-4" />
                                    {advisor.phone}
                                </a>
                            )}
                        </div>

                        {advisor.specialties && advisor.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {advisor.specialties.map((s: string) => (
                                    <span key={s} className="text-xs bg-[#1A4D3E]/5 text-[#1A4D3E] px-3 py-1 font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-[#4A5565]/10">
                    <Link
                        href="/portal/appointments"
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                    >
                        <Calendar className="h-4 w-4" />
                        Schedule Appointment
                    </Link>
                    <Link
                        href="/portal/messages"
                        className="flex items-center gap-2 px-6 py-3 border border-[#1A4D3E] text-[#1A4D3E] text-sm font-medium hover:bg-[#1A4D3E]/5 transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        Send Message
                    </Link>
                    {advisor.calendar_url && (
                        <a
                            href={advisor.calendar_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 border border-[#4A5565]/20 text-[#4A5565] text-sm font-medium hover:bg-[#f0f2f1] transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Calendar
                        </a>
                    )}
                </div>
            </div>

            {/* Appointment History */}
            <div className="bg-white border border-[#4A5565]/10 shadow-sm">
                <div className="px-6 py-4 border-b border-[#4A5565]/10">
                    <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider">Appointment History</h3>
                </div>
                {pastAppointments.length === 0 ? (
                    <div className="p-6 text-sm text-[#4A5565] text-center">No appointments yet</div>
                ) : (
                    <div className="divide-y divide-[#4A5565]/10">
                        {pastAppointments.map((apt) => (
                            <div key={apt.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#1A4D3E] capitalize">
                                        {(apt.type || 'appointment').replace('-', ' ')}
                                    </p>
                                    <p className="text-xs text-[#4A5565]">{formatDate(apt.scheduled_at)}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 capitalize ${
                                    apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                    apt.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                    apt.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                                    'bg-gray-50 text-gray-700'
                                }`}>
                                    {apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
