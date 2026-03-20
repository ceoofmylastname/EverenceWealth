'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Users, UserPlus, CheckSquare, Calendar, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    advisorId: string
    activeClients: number
    openLeads: number
    pendingTasks: number
    upcomingAppointments: any[]
    unreadMessages: number
    recentTasks: any[]
}

export default function AgentDashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        loadDashboard()
    }, [user])

    async function loadDashboard() {
        try {
            const supabase = createClient()

            // Get advisor profile
            const { data: advisor } = await supabase
                .from('advisors')
                .select('id, first_name, last_name, metrics')
                .eq('user_id', user!.id)
                .single()

            if (!advisor) {
                setLoading(false)
                return
            }

            // Parallel fetch all dashboard data
            const [
                clientsRes,
                leadsRes,
                tasksRes,
                appointmentsRes,
                messagesRes,
            ] = await Promise.all([
                supabase.from('clients').select('id', { count: 'exact' }).eq('advisor_id', advisor.id).eq('status', 'active'),
                supabase.from('leads').select('id', { count: 'exact' }).eq('assigned_advisor_id', advisor.id).neq('status', 'converted'),
                supabase.from('tasks').select('*').eq('advisor_id', advisor.id).in('status', ['pending', 'in-progress']).order('due_date', { ascending: true }).limit(5),
                supabase.from('appointments').select('*, clients(first_name, last_name)').eq('advisor_id', advisor.id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(5),
                supabase.from('messages').select('id', { count: 'exact' }).eq('recipient_id', advisor.id).eq('recipient_type', 'advisor').eq('read', false),
            ])

            setStats({
                advisorId: advisor.id,
                activeClients: clientsRes.count || 0,
                openLeads: leadsRes.count || 0,
                pendingTasks: (tasksRes.data || []).length,
                upcomingAppointments: appointmentsRes.data || [],
                unreadMessages: messagesRes.count || 0,
                recentTasks: tasksRes.data || [],
            })
        } catch (err) {
            console.error('Dashboard load error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

    const firstName = user?.user_metadata?.first_name || 'Agent'

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {firstName}
                </h1>
                <p className="text-gray-400 mt-1">
                    Here&apos;s your agent dashboard overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="h-5 w-5" />} label="Active Clients" value={stats?.activeClients || 0} href="/agent/clients" />
                <StatCard icon={<UserPlus className="h-5 w-5" />} label="Open Leads" value={stats?.openLeads || 0} href="/agent/leads" />
                <StatCard icon={<CheckSquare className="h-5 w-5" />} label="Pending Tasks" value={stats?.pendingTasks || 0} href="/agent/tasks" />
                <StatCard icon={<MessageSquare className="h-5 w-5" />} label="Unread Messages" value={stats?.unreadMessages || 0} href="/agent/messages" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Link href="/agent/leads" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <UserPlus className="h-5 w-5 text-brand-gold" />
                        <span className="text-sm font-medium text-white">View Leads</span>
                    </Link>
                    <Link href="/agent/clients" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <Users className="h-5 w-5 text-brand-gold" />
                        <span className="text-sm font-medium text-white">My Clients</span>
                    </Link>
                    <Link href="/agent/tasks" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <CheckSquare className="h-5 w-5 text-brand-gold" />
                        <span className="text-sm font-medium text-white">Tasks</span>
                    </Link>
                    <Link href="/agent/messages" className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <MessageSquare className="h-5 w-5 text-brand-gold" />
                        <span className="text-sm font-medium text-white">Messages</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming Appointments</h3>
                        <Link href="/agent/appointments" className="text-sm text-brand-gold hover:text-brand-gold/80 font-medium">
                            View all
                        </Link>
                    </div>
                    {(stats?.upcomingAppointments?.length || 0) === 0 ? (
                        <p className="text-sm text-gray-500 py-4">No upcoming appointments</p>
                    ) : (
                        <div className="space-y-3">
                            {stats!.upcomingAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-brand-gold" />
                                        <div>
                                            <p className="text-sm font-medium text-white capitalize">
                                                {apt.type.replace('-', ' ')}
                                                {apt.clients && ` — ${apt.clients.first_name} ${apt.clients.last_name}`}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDate(apt.scheduled_at)}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 capitalize">{apt.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Tasks */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Tasks</h3>
                        <Link href="/agent/tasks" className="text-sm text-brand-gold hover:text-brand-gold/80 font-medium">
                            View all
                        </Link>
                    </div>
                    {(stats?.recentTasks?.length || 0) === 0 ? (
                        <p className="text-sm text-gray-500 py-4">No pending tasks</p>
                    ) : (
                        <div className="space-y-3">
                            {stats!.recentTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-white">{task.title}</p>
                                        {task.due_date && (
                                            <p className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                                        task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                        task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number; href: string }) {
    return (
        <Link href={href} className="bg-white/5 border border-white/10 p-5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="text-brand-gold">{icon}</div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
        </Link>
    )
}
