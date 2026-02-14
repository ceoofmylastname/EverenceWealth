import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, FileText } from 'lucide-react'
import { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogCardProps {
    post: BlogPost
    variant?: 'default' | 'featured' | 'wide'
}

const FUNNEL_BADGES: Record<string, { bg: string; text: string; label: string }> = {
    tofu: { bg: 'bg-blue-500/15 border-blue-300/40', text: 'text-blue-700', label: 'Awareness' },
    mofu: { bg: 'bg-amber-500/15 border-amber-300/40', text: 'text-amber-700', label: 'Consideration' },
    bofu: { bg: 'bg-emerald-500/15 border-emerald-300/40', text: 'text-emerald-700', label: 'Decision' },
}

const DEFAULT_BADGE = { bg: 'bg-white/60 border-white/50', text: 'text-[#4A5565]', label: 'Article' }

const BLOG_IMAGES = [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800&auto=format&fit=crop',
]

function getImageForPost(postId: string): string {
    let hash = 0
    for (let i = 0; i < postId.length; i++) {
        hash = ((hash << 5) - hash) + postId.charCodeAt(i)
        hash |= 0
    }
    return BLOG_IMAGES[Math.abs(hash) % BLOG_IMAGES.length]
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
    const badge = (post.funnel_stage && FUNNEL_BADGES[post.funnel_stage]) || DEFAULT_BADGE
    const imageUrl = getImageForPost(post.id)

    // ==================== FEATURED ====================
    if (variant === 'featured') {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="group relative block overflow-hidden rounded-3xl glass-card-light transition-all duration-500 blog-card-3d"
            >
                <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-gradient-to-r from-[#1A4D3E] via-[#10B981] to-[#1A4D3E]" />

                <div className="grid gap-0 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-[260px] overflow-hidden md:h-full md:min-h-[400px]">
                        <Image
                            src={imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 hidden md:block" />

                        <div className="absolute left-5 top-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#1A4D3E]/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-sm">
                                Featured Article
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-7 md:p-10 lg:p-14">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm ${badge.bg} ${badge.text}`}>
                                {badge.label}
                            </span>
                            <span className="flex items-center text-xs text-[#4A5565]/70">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                {post.reading_time || 5} min
                            </span>
                            <span className="flex items-center text-xs text-[#4A5565]/70">
                                <FileText className="mr-1 h-3.5 w-3.5" />
                                {(post.word_count || 0).toLocaleString()} words
                            </span>
                        </div>

                        <h3 className="mb-4 font-space-grotesk text-2xl font-bold leading-tight text-[#1A4D3E] transition-colors duration-300 group-hover:text-[#10B981] md:text-3xl lg:text-4xl">
                            {post.title}
                        </h3>

                        <p className="mb-6 line-clamp-3 text-base leading-relaxed text-[#4A5565] md:text-lg">
                            {post.meta_description || "Discover strategic insights on wealth preservation, tax optimization, and building a legacy that lasts for generations."}
                        </p>

                        <div className="mt-auto">
                            <span className="inline-flex items-center gap-2 rounded-xl bg-[#1A4D3E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1A4D3E]/20 transition-all group-hover:bg-[#10B981] group-hover:shadow-xl group-hover:shadow-[#10B981]/25">
                                Read Article
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // ==================== WIDE (Spotlight) ====================
    if (variant === 'wide') {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card-light transition-all duration-500 blog-card-3d sm:flex-row"
            >
                <div className="absolute left-0 right-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#1A4D3E] via-[#10B981] to-[#1A4D3E] transition-transform duration-500 group-hover:scale-x-100" />

                {/* Image */}
                <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden sm:h-auto sm:w-[45%]">
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/20" />

                    <div className="absolute left-4 top-4">
                        <span className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${badge.bg} ${badge.text}`}>
                            {badge.label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                    <div className="mb-2 flex items-center gap-3 text-xs text-[#4A5565]/60">
                        <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {post.reading_time || 5} min
                        </span>
                        <span className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            {(post.word_count || 0).toLocaleString()} words
                        </span>
                    </div>

                    <h3 className="mb-2 font-space-grotesk text-lg font-bold leading-snug text-[#1A4D3E] transition-colors duration-300 group-hover:text-[#10B981] sm:text-xl line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#4A5565]">
                        {post.meta_description || "Discover strategic insights on wealth preservation and tax optimization."}
                    </p>

                    <div className="mt-auto flex items-center text-sm font-semibold text-[#1A4D3E]">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </div>
            </Link>
        )
    }

    // ==================== DEFAULT ====================
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group relative block h-full overflow-hidden rounded-2xl glass-card-light transition-all duration-500 blog-card-3d"
        >
            <div className="absolute left-0 right-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#1A4D3E] via-[#10B981] to-[#1A4D3E] transition-transform duration-500 group-hover:scale-x-100" />

            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                <div className="absolute left-4 top-4">
                    <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${badge.bg} ${badge.text}`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-5">
                <div className="mb-2.5 flex items-center gap-3 text-xs text-[#4A5565]/60">
                    <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {post.reading_time || 5} min
                    </span>
                    <span className="flex items-center">
                        <FileText className="mr-1 h-3 w-3" />
                        {(post.word_count || 0).toLocaleString()} words
                    </span>
                </div>

                <h3 className="mb-2.5 font-space-grotesk text-base font-bold leading-snug text-[#1A4D3E] transition-colors duration-300 group-hover:text-[#10B981] sm:text-lg line-clamp-2">
                    {post.title}
                </h3>

                <p className="mb-4 flex-grow line-clamp-2 text-sm leading-relaxed text-[#4A5565]">
                    {post.meta_description || "Discover strategic insights on wealth preservation, tax optimization, and building a legacy."}
                </p>

                <div className="mt-auto flex items-center text-sm font-semibold text-[#1A4D3E]">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
            </div>
        </Link>
    )
}
