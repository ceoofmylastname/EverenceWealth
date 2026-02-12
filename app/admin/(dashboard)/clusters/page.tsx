'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Loader2, ArrowRight, Layout, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database'

type Cluster = Database['public']['Tables']['clusters']['Row']

export default function ClustersPage() {
    const [clusters, setClusters] = useState<Cluster[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchClusters()
    }, [])

    const fetchClusters = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('clusters')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching clusters:', error)
        } else {
            setClusters(data || [])
        }
        setLoading(false)
    }

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'published': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'generating': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            default: return 'bg-gray-500/10 text-gray-400'
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-brand-gold">Blog Clusters</h2>
                    <p className="mt-1 text-sm text-gray-400">Manage your strategic content funnels.</p>
                </div>
                <Link
                    href="/admin/clusters/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold focus:ring-offset-[#020806] transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Cluster
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search clusters..."
                        className="w-full bg-[#0A1210] border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-gray-600"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 bg-[#0A1210] border border-white/10 rounded-md text-sm text-gray-400 hover:text-white transition-colors">
                        <Filter className="h-4 w-4 mr-2" />
                        All Status
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
                </div>
            ) : clusters.length === 0 ? (
                <div className="text-center py-20 bg-[#0A1210] rounded-xl border border-white/5">
                    <Layout className="h-12 w-12 text-gray-600 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-white">No clusters yet</h3>
                    <p className="mt-1 text-gray-500 max-w-sm mx-auto">Get started by creating your first content cluster to implement the 3-2-1 funnel strategy.</p>
                    <Link
                        href="/admin/clusters/new"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-white/10 rounded-md text-sm font-medium text-brand-gold hover:bg-white/5 transition-colors"
                    >
                        Create Your First Cluster
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {clusters.map((cluster) => (
                        <div key={cluster.id} className="glass-card rounded-xl p-6 border border-white/10 hover:border-brand-gold/30 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-brand-gold transition-colors">
                                            {cluster.name}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(cluster.status)} uppercase tracking-wide`}>
                                            {cluster.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 max-w-2xl line-clamp-2">
                                        Topic: {cluster.topic} • Audience: {cluster.target_audience}
                                    </p>

                                    {/* Funnel Progress */}
                                    <div className="space-y-3 max-w-3xl">
                                        <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                            <span>Funnel Progress</span>
                                            <span>{Math.round(((cluster.content_count || 0) / (cluster.required_content_count || 6)) * 100)}% Complete</span>
                                        </div>
                                        <div className="h-2 bg-[#0A1210] rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-gold/60 to-brand-gold transition-all duration-1000 ease-out"
                                                style={{ width: `${((cluster.content_count || 0) / (cluster.required_content_count || 6)) * 100}%` }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-2">
                                            <div className="text-center md:text-left">
                                                <div className="text-xs text-gray-500 mb-1">TOFU (Awareness)</div>
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${cluster.content_count && cluster.content_count >= 3 ? 'bg-green-500' : 'bg-gray-600'}`} />
                                                    <span className="text-sm font-medium text-white">
                                                        {cluster.content_count ? Math.min(cluster.content_count, 3) : 0}/3
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-left pl-4 border-l border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">MOFU (Consideration)</div>
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${cluster.content_count && cluster.content_count >= 5 ? 'bg-green-500' : 'bg-gray-600'}`} />
                                                    <span className="text-sm font-medium text-white">
                                                        {cluster.content_count ? Math.max(0, Math.min(cluster.content_count - 3, 2)) : 0}/2
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-left pl-4 border-l border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">BOFU (Decision)</div>
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${cluster.content_count && cluster.content_count >= 6 ? 'bg-green-500' : 'bg-gray-600'}`} />
                                                    <span className="text-sm font-medium text-white">
                                                        {cluster.content_count ? Math.max(0, Math.min(cluster.content_count - 5, 1)) : 0}/1
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3 justify-end min-w-[140px]">
                                    <Link
                                        href={`/admin/clusters/${cluster.id}`}
                                        className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm font-medium text-white transition-colors"
                                    >
                                        View Funnel
                                    </Link>
                                    <button className="flex items-center justify-center px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 rounded-md text-sm font-medium text-brand-gold transition-colors">
                                        Generate
                                        <ArrowRight className="ml-2 h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
