import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogCardProps {
    post: BlogPost
    featured?: boolean
}

const FUNNEL_BADGES: Record<string, { bg: string; text: string; border: string; label: string }> = {
    tofu: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Awareness' },
    mofu: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Consideration' },
    bofu: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Decision' },
}

const DEFAULT_BADGE = { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: 'Article' }

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const badge = (post.funnel_stage && FUNNEL_BADGES[post.funnel_stage]) || DEFAULT_BADGE
    const imageUrl = post.featured_image || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop'

    if (featured) {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className="group relative block overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#1A4D3E]/20 hover:shadow-[0_20px_60px_rgba(26,77,62,0.15)]"
            >
                <div className="grid gap-0 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-[280px] overflow-hidden md:h-full md:min-h-[400px]">
                        <Image
                            src={imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D3E]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-8 md:p-10 lg:p-14">
                        <div className="mb-5 flex items-center gap-3">
                            <span className={`inline-block rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                                {badge.label}
                            </span>
                            <span className="flex items-center text-xs font-medium text-[#4A5565]">
                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                {post.reading_time || 5} min read
                            </span>
                        </div>

                        <h3 className="mb-4 font-space-grotesk text-2xl font-bold leading-tight text-[#1A4D3E] transition-colors group-hover:text-[#2a6b56] md:text-3xl lg:text-4xl">
                            {post.title}
                        </h3>

                        <p className="mb-8 line-clamp-3 text-base leading-relaxed text-[#4A5565] md:text-lg">
                            {post.meta_description || "Discover strategic insights on wealth preservation, tax optimization, and building a legacy that lasts for generations."}
                        </p>

                        <div className="mt-auto flex items-center text-sm font-bold tracking-wide text-[#1A4D3E]">
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group relative block h-full overflow-hidden rounded-[20px] border border-transparent bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#1A4D3E]/20 hover:shadow-[0_20px_60px_rgba(26,77,62,0.15)]"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D3E]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 md:p-7">
                <div className="mb-4 flex items-center gap-3">
                    <span className={`inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                    </span>
                    <span className="flex items-center text-xs font-medium text-[#4A5565]">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {post.reading_time || 5} min read
                    </span>
                </div>

                <h3 className="mb-3 font-space-grotesk text-xl font-bold leading-snug text-[#1A4D3E] transition-colors group-hover:text-[#2a6b56] lg:text-2xl">
                    {post.title}
                </h3>

                <p className="mb-5 flex-grow line-clamp-3 text-sm leading-relaxed text-[#4A5565]">
                    {post.meta_description || "Discover strategic insights on wealth preservation, tax optimization, and building a legacy that lasts for generations."}
                </p>

                <div className="mt-auto flex items-center text-sm font-bold tracking-wide text-[#1A4D3E]">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
            </div>
        </Link>
    )
}
