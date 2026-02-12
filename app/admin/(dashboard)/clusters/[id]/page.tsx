'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, FileText, Eye, Clock, CheckCircle, Circle, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Database } from '@/types/database'

type Cluster = Database['public']['Tables']['clusters']['Row']
type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export default function ClusterFunnelPage() {
    const params = useParams()
    const [cluster, setCluster] = useState<Cluster | null>(null)
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (params.id) {
            fetchData(params.id as string)
        }
    }, [params.id])

    const fetchData = async (id: string) => {
        setLoading(true)

        // Fetch Cluster
        const { data: clusterData, error: clusterError } = await supabase
            .from('clusters')
            .select('*')
            .eq('id', id)
            .single()

        if (clusterError) {
            console.error('Error fetching cluster:', clusterError)
        } else {
            setCluster(clusterData)
        }

        // Fetch Posts
        const { data: postsData, error: postsError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('cluster_id', id)
            .order('funnel_position', { ascending: true })

        if (postsError) {
            console.error('Error fetching posts:', postsError)
        } else {
            setPosts(postsData || [])
        }

        setLoading(false)
    }

    const tofuPosts = posts.filter(p => p.funnel_stage === 'tofu')
    const mofuPosts = posts.filter(p => p.funnel_stage === 'mofu')
    const bofuPosts = posts.filter(p => p.funnel_stage === 'bofu')

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    if (!cluster) {
        return <div className="text-white">Cluster not found</div>
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/clusters" className="flex items-center text-sm text-gray-400 hover:text-white mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Clusters
                    </Link>
                    <h2 className="text-3xl font-bold text-white">{cluster.name}</h2>
                    <p className="mt-1 text-sm text-gray-400">Content Funnel Strategy for {cluster.topic}</p>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border uppercase tracking-wide ${cluster.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                        {cluster.status}
                    </span>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="max-w-4xl mx-auto space-y-4">

                {/* TOFU */}
                <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-900/20 to-[#0A1210] px-6 py-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                            TOFU (Awareness)
                        </h3>
                        <span className="text-xs text-gray-400">{tofuPosts.length}/3 Articles</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {tofuPosts.map(post => (
                            <PostRow key={post.id} post={post} color="text-blue-400" bgColor="bg-blue-500/10" />
                        ))}
                        {tofuPosts.length === 0 && <EmptyRow message="No TOFU articles generated yet" />}
                    </div>
                </div>

                <div className="flex justify-center text-gray-600">
                    <ArrowDown className="h-6 w-6 animate-bounce" />
                </div>

                {/* MOFU */}
                <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-900/20 to-[#0A1210] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>
                            MOFU (Consideration)
                        </h3>
                        <span className="text-xs text-gray-400">{mofuPosts.length}/2 Articles</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {mofuPosts.map(post => (
                            <PostRow key={post.id} post={post} color="text-yellow-400" bgColor="bg-yellow-500/10" />
                        ))}
                        {mofuPosts.length === 0 && <EmptyRow message="No MOFU articles generated yet" />}
                    </div>
                </div>

                <div className="flex justify-center text-gray-600">
                    <ArrowDown className="h-6 w-6 animate-bounce" />
                </div>

                {/* BOFU */}
                <div className="bg-[#0A1210] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-900/20 to-[#0A1210] px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                            BOFU (Decision)
                        </h3>
                        <span className="text-xs text-gray-400">{bofuPosts.length}/1 Article</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {bofuPosts.map(post => (
                            <PostRow key={post.id} post={post} color="text-green-400" bgColor="bg-green-500/10" />
                        ))}
                        {bofuPosts.length === 0 && <EmptyRow message="No BOFU article generated yet" />}
                    </div>
                </div>

            </div>
        </div>
    )
}

function PostRow({ post, color, bgColor }: { post: BlogPost, color: string, bgColor: string }) {
    return (
        <div className="px-6 py-4 hover:bg-white/5 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} ${color} flex items-center justify-center font-bold text-sm`}>
                    {post.funnel_position}
                </div>
                <div>
                    <h4 className="text-white font-medium group-hover:text-brand-gold transition-colors">{post.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                            {post.status === 'published' ? <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> : <Circle className="w-3 h-3 mr-1" />}
                            {post.status}
                        </span>
                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {post.views || 0} views</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.reading_time || 5} min read</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1 text-xs font-medium text-white border border-white/10 rounded hover:bg-white/10">Edit</button>
                <button className="px-3 py-1 text-xs font-medium text-brand-gold border border-brand-gold/20 rounded hover:bg-brand-gold/10">View</button>
            </div>
        </div>
    )
}

function EmptyRow({ message }: { message: string }) {
    return (
        <div className="px-6 py-8 text-center text-gray-500 italic text-sm">
            {message}
        </div>
    )
}
