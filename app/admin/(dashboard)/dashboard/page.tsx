'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/admin/StatsCard'
import { FileText, Share2, CircleHelp, Layers } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('Admin')
    const supabase = createClient()

    useEffect(() => {

        async function getUser() {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) {
                    console.error('Error fetching user:', error)
                }
                if (user) {
                    setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin')
                }
            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [])


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-evergreen" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-brand-gold">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-400">Welcome back, {userName}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Blogs" value="0" icon={FileText} />
                <StatsCard title="Active Clusters" value="0" icon={Share2} />
                <StatsCard title="Clusters Complete" value="0" icon={Layers} />
                <StatsCard title="Q&A Pages" value="0" icon={CircleHelp} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="glass-card rounded-xl overflow-hidden shadow">
                    <div className="p-5">
                        <h3 className="text-lg leading-6 font-medium text-white">Recent Activity</h3>
                        <div className="mt-5 border-t border-white/10">
                            <dl className="divide-y divide-white/10">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-400">System Status</dt>
                                    <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2 flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                        Online
                                    </dd>
                                </div>
                                {/* Placeholder for real activity log */}
                                <div className="py-4 text-sm text-gray-500 italic text-center">
                                    No recent activity to display.
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-xl overflow-hidden shadow p-6">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-white">Quick Actions</h3>
                        <div className="mt-5 grid grid-cols-1 gap-3">
                            <button
                                disabled
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-evergreen bg-white/90 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-evergreen sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                + Create New Cluster (Coming Soon)
                            </button>
                            <Link
                                href="/admin/settings"
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 shadow-sm font-medium rounded-md text-white bg-transparent hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-evergreen sm:text-sm transition-colors"
                            >
                                Manage Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
