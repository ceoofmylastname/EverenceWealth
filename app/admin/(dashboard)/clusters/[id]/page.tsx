'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, FileText, Clock, CheckCircle, Circle, ArrowDown, Rocket, Eye, Pencil, Globe, EyeOff, Languages } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Database } from '@/types/database'
import toast from 'react-hot-toast'
import ArticleEditorModal from '@/components/admin/ArticleEditorModal'
import ArticlePreviewModal from '@/components/admin/ArticlePreviewModal'

type Cluster = Database['public']['Tables']['clusters']['Row']
type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export default function ClusterFunnelPage() {
    const params = useParams()
    const [cluster, setCluster] = useState<Cluster | null>(null)
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [translating, setTranslating] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (params.id) {
            fetchData(params.id as string)
        }
    }, [params.id])

    const fetchData = async (id: string) => {
        setLoading(true)

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

    const handlePublishCluster = async () => {
        if (!cluster) return
        setPublishing(true)
        try {
            const res = await fetch(`/api/clusters/${cluster.id}/publish`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to publish')
            toast.success(`Published ${data.published_count} articles!`)
            fetchData(cluster.id)
        } catch (err: any) {
            toast.error(err.message || 'Failed to publish cluster')
        } finally {
            setPublishing(false)
        }
    }

    const handlePublishArticle = async (postId: string) => {
        try {
            const res = await fetch(`/api/articles/${postId}/publish`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to publish')
            toast.success('Article published')
            setPosts(prev => prev.map(p => p.id === postId ? data.article : p))
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleUnpublishArticle = async (postId: string) => {
        try {
            const res = await fetch(`/api/articles/${postId}/publish`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to unpublish')
            toast.success('Article unpublished')
            setPosts(prev => prev.map(p => p.id === postId ? data.article : p))
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleTranslateCluster = async () => {
        if (!cluster) return
        setTranslating(true)
        try {
            const res = await fetch(`/api/clusters/${cluster.id}/translate`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to start translation')
            toast.success(`Translating ${data.translation_count} articles to Spanish...`)
            // Poll for updates
            const poll = setInterval(async () => {
                await fetchData(cluster.id)
            }, 5000)
            setTimeout(() => clearInterval(poll), 120000)
        } catch (err: any) {
            toast.error(err.message || 'Failed to translate cluster')
        } finally {
            setTranslating(false)
        }
    }

    const handleArticleSaved = (updated: BlogPost) => {
        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))
        setEditingPost(null)
    }

    const enPosts = posts.filter(p => p.language === 'en')
    const esPosts = posts.filter(p => p.language === 'es')
    const tofuPosts = posts.filter(p => p.funnel_stage === 'tofu')
    const mofuPosts = posts.filter(p => p.funnel_stage === 'mofu')
    const bofuPosts = posts.filter(p => p.funnel_stage === 'bofu')
    const reviewCount = posts.filter(p => p.status === 'review').length
    const publishedCount = posts.filter(p => p.status === 'published').length
    const enPostCount = enPosts.filter(p => p.status === 'review' || p.status === 'published').length
    const esPostCount = esPosts.filter(p => p.status === 'review' || p.status === 'published').length
    const generatingEsCount = esPosts.filter(p => p.status === 'generating').length

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <Link href="/admin/clusters" className="flex items-center text-sm text-gray-400 hover:text-white mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Clusters
                    </Link>
                    <h2 className="text-3xl font-bold text-white">{cluster.name}</h2>
                    <p className="mt-1 text-sm text-gray-400">Content Funnel Strategy for {cluster.topic}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-medium border uppercase tracking-wide ${
                        cluster.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        cluster.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                        {cluster.status}
                    </span>
                    {enPostCount >= 6 && esPostCount === 0 && (
                        <button
                            onClick={handleTranslateCluster}
                            disabled={translating || generatingEsCount > 0}
                            className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            {translating || generatingEsCount > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                            {translating ? 'Translating...' : generatingEsCount > 0 ? 'Translating...' : 'Translate to Spanish'}
                        </button>
                    )}
                    {(cluster.status === 'draft' || cluster.status === 'generating') && reviewCount > 0 && (
                        <button
                            onClick={handlePublishCluster}
                            disabled={publishing}
                            className="flex items-center gap-2 px-5 py-2 bg-brand-gold hover:bg-brand-gold/90 text-[#020806] text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                            {publishing ? 'Publishing...' : 'Publish Cluster'}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-[#0A1210] border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{posts.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Articles</div>
                </div>
                <div className="bg-[#0A1210] border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-400">{reviewCount}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">In Review</div>
                </div>
                <div className="bg-[#0A1210] border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{publishedCount}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Published</div>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="max-w-4xl mx-auto space-y-4">
                <FunnelSection
                    title="TOFU (Awareness)"
                    posts={tofuPosts}
                    expected={3}
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                    gradientFrom="from-blue-900/20"
                    dotColor="bg-blue-500"
                    onEdit={setEditingPost}
                    onPreview={setPreviewPost}
                    onPublish={handlePublishArticle}
                    onUnpublish={handleUnpublishArticle}
                />

                <div className="flex justify-center text-gray-600">
                    <ArrowDown className="h-6 w-6 animate-bounce" />
                </div>

                <FunnelSection
                    title="MOFU (Consideration)"
                    posts={mofuPosts}
                    expected={2}
                    color="text-yellow-400"
                    bgColor="bg-yellow-500/10"
                    gradientFrom="from-yellow-900/20"
                    dotColor="bg-yellow-500"
                    onEdit={setEditingPost}
                    onPreview={setPreviewPost}
                    onPublish={handlePublishArticle}
                    onUnpublish={handleUnpublishArticle}
                />

                <div className="flex justify-center text-gray-600">
                    <ArrowDown className="h-6 w-6 animate-bounce" />
                </div>

                <FunnelSection
                    title="BOFU (Decision)"
                    posts={bofuPosts}
                    expected={1}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                    gradientFrom="from-green-900/20"
                    dotColor="bg-green-500"
                    onEdit={setEditingPost}
                    onPreview={setPreviewPost}
                    onPublish={handlePublishArticle}
                    onUnpublish={handleUnpublishArticle}
                />
            </div>

            {/* Modals */}
            {editingPost && (
                <ArticleEditorModal
                    key={editingPost.id}
                    post={editingPost}
                    open={true}
                    onClose={() => setEditingPost(null)}
                    onSaved={handleArticleSaved}
                />
            )}
            {previewPost && (
                <ArticlePreviewModal
                    post={previewPost}
                    open={true}
                    onClose={() => setPreviewPost(null)}
                />
            )}
        </div>
    )
}

function FunnelSection({ title, posts, expected, color, bgColor, gradientFrom, dotColor, onEdit, onPreview, onPublish, onUnpublish }: {
    title: string
    posts: BlogPost[]
    expected: number
    color: string
    bgColor: string
    gradientFrom: string
    dotColor: string
    onEdit: (post: BlogPost) => void
    onPreview: (post: BlogPost) => void
    onPublish: (id: string) => void
    onUnpublish: (id: string) => void
}) {
    return (
        <div className="bg-[#0A1210] border border-white/10 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradientFrom} to-[#0A1210] px-6 py-4 border-b border-white/10 flex justify-between items-center`}>
                <h3 className="text-lg font-bold text-white flex items-center">
                    <span className={`w-2 h-2 rounded-full ${dotColor} mr-3`}></span>
                    {title}
                </h3>
                <span className="text-xs text-gray-400">{posts.length}/{expected} Articles</span>
            </div>
            <div className="divide-y divide-white/5">
                {posts.map(post => (
                    <PostRow
                        key={post.id}
                        post={post}
                        color={color}
                        bgColor={bgColor}
                        onEdit={() => onEdit(post)}
                        onPreview={() => onPreview(post)}
                        onPublish={() => onPublish(post.id)}
                        onUnpublish={() => onUnpublish(post.id)}
                    />
                ))}
                {posts.length === 0 && <EmptyRow message={`No ${title.split(' ')[0]} articles generated yet`} />}
            </div>
        </div>
    )
}

function PostRow({ post, color, bgColor, onEdit, onPreview, onPublish, onUnpublish }: {
    post: BlogPost
    color: string
    bgColor: string
    onEdit: () => void
    onPreview: () => void
    onPublish: () => void
    onUnpublish: () => void
}) {
    const isPublished = post.status === 'published'

    return (
        <div className="px-6 py-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`flex-shrink-0 w-8 h-8 ${bgColor} ${color} flex items-center justify-center font-bold text-sm`}>
                        {post.funnel_position}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-white font-medium group-hover:text-brand-gold transition-colors truncate">{post.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span className="flex items-center">
                                {isPublished
                                    ? <Globe className="w-3 h-3 mr-1 text-green-500" />
                                    : post.status === 'review'
                                        ? <CheckCircle className="w-3 h-3 mr-1 text-amber-400" />
                                        : <Circle className="w-3 h-3 mr-1" />
                                }
                                <span className={isPublished ? 'text-green-400' : post.status === 'review' ? 'text-amber-400' : ''}>
                                    {post.status}
                                </span>
                            </span>
                            <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> {post.word_count || 0} words</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.reading_time || 0} min</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onPreview}
                        className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1"
                        title="Preview"
                    >
                        <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                        onClick={onEdit}
                        className="px-3 py-1.5 text-xs font-medium text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1"
                        title="Edit"
                    >
                        <Pencil className="w-3 h-3" /> Edit
                    </button>
                    {isPublished ? (
                        <button
                            onClick={onUnpublish}
                            className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                            title="Unpublish"
                        >
                            <EyeOff className="w-3 h-3" /> Unpublish
                        </button>
                    ) : post.status === 'review' ? (
                        <button
                            onClick={onPublish}
                            className="px-3 py-1.5 text-xs font-medium text-brand-gold border border-brand-gold/20 hover:bg-brand-gold/10 transition-colors flex items-center gap-1"
                            title="Publish"
                        >
                            <Globe className="w-3 h-3" /> Publish
                        </button>
                    ) : null}
                </div>
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
