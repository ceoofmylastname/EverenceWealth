import { createServiceClient } from '@/lib/supabase/server'
import BlogCard from '@/components/BlogCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Metadata } from 'next'
import { collectionPageSchema, breadcrumbSchema, JsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const revalidate = 60

export const metadata: Metadata = {
    title: 'Financial Strategies Blog | Everence Wealth',
    description: 'Explore fiduciary wealth strategies, tax optimization, and retirement planning insights from Everence Wealth.',
    alternates: { canonical: `${siteUrl}/blog` },
    openGraph: {
        title: 'Financial Strategies Blog | Everence Wealth',
        description: 'Explore fiduciary wealth strategies, tax optimization, and retirement planning insights from Everence Wealth.',
    }
}

const STAGE_FILTERS = [
    { value: '', label: 'All', icon: '✦', activeClass: 'bg-[#1A4D3E] text-white shadow-lg shadow-[#1A4D3E]/25' },
    { value: 'tofu', label: 'Awareness', icon: '◎', activeClass: 'bg-blue-500/15 text-blue-700 border border-blue-300/50' },
    { value: 'mofu', label: 'Consideration', icon: '◈', activeClass: 'bg-amber-500/15 text-amber-700 border border-amber-300/50' },
    { value: 'bofu', label: 'Decision', icon: '◆', activeClass: 'bg-emerald-500/15 text-emerald-700 border border-emerald-300/50' },
]

// Smart pagination: shows 1 2 3 ... 55 56 57 ... 109 110 111
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: (number | 'ellipsis')[] = [1]

    if (current > 3) pages.push('ellipsis')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('ellipsis')
    if (total > 1) pages.push(total)

    return pages
}

function buildHref(params: { page?: number; stage?: string; q?: string; sort?: string }) {
    const parts: string[] = []
    if (params.page && params.page > 1) parts.push(`page=${params.page}`)
    if (params.stage) parts.push(`stage=${params.stage}`)
    if (params.q) parts.push(`q=${params.q}`)
    if (params.sort && params.sort !== 'newest') parts.push(`sort=${params.sort}`)
    return `/blog${parts.length ? '?' + parts.join('&') : ''}`
}

export default async function BlogPage({
    searchParams
}: {
    searchParams: { page?: string; stage?: string; q?: string; sort?: string }
}) {
    const supabase = createServiceClient()
    const page = Number(searchParams.page) || 1
    const pageSize = 9
    const stage = searchParams.stage
    const query = searchParams.q
    const sort = searchParams.sort || 'newest'

    let dbQuery = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: sort === 'oldest' })

    if (stage && ['tofu', 'mofu', 'bofu'].includes(stage)) {
        dbQuery = dbQuery.eq('funnel_stage', stage)
    }

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: posts, count } = await dbQuery.range(from, to)
    const totalCount = count || 0
    const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0

    // Featured post: only on page 1 with no active filters
    const isUnfiltered = page === 1 && !query && !stage && sort === 'newest'
    const featuredPost = isUnfiltered ? posts?.[0] : null
    // Wide spotlight posts: next 2 after featured
    const spotlightPosts = isUnfiltered ? posts?.slice(1, 3) : null
    // Standard grid posts: rest
    const gridPosts = isUnfiltered ? posts?.slice(3) : posts

    const pageNumbers = getPageNumbers(page, totalPages)
    const showingFrom = from + 1
    const showingTo = Math.min(from + pageSize, totalCount)
    const hasActiveFilters = !!stage || !!query || sort !== 'newest'

    return (
        <div className="flex min-h-screen flex-col bg-[#f0f4f3]">
            <JsonLd data={collectionPageSchema({ name: 'Everence Wealth Blog', description: 'Straight talk on wealth, taxes, and retirement. Actionable strategies for your financial future.', url: `${siteUrl}/blog` })} />
            <JsonLd data={breadcrumbSchema([{ name: 'Home', url: siteUrl }, { name: 'Blog', url: `${siteUrl}/blog` }])} />
            <Navbar />

            <main className="flex-grow">
                {/* ====== HERO ====== */}
                <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36 bg-gradient-to-b from-[#1A4D3E] via-[#1f5e4c] to-[#f0f4f3]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_60%)] blur-[80px]" />
                        <div className="absolute -right-20 top-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] blur-[60px]" />
                        <div className="absolute bottom-0 left-1/3 h-[400px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(236,218,118,0.08)_0%,transparent_60%)] blur-[100px]" />
                    </div>
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                    />

                    <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="indexed-fade-rise mb-5" style={{ animationDelay: '0.1s' }}>
                            <span className="inline-block rounded-full border border-white/25 bg-white/10 px-5 py-2 font-space-grotesk text-[10px] font-bold tracking-[0.3em] text-white/90 backdrop-blur-md md:text-xs">
                                INSIGHTS & STRATEGIES
                            </span>
                        </div>
                        <h1 className="indexed-fade-rise mb-5" style={{ animationDelay: '0.3s' }}>
                            <span className="block font-space-grotesk text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                Wealth Strategies
                            </span>
                            <span className="mt-1 block font-space-grotesk text-4xl font-black tracking-tight text-white/60 sm:text-5xl md:text-6xl lg:text-7xl">
                                & Financial Insights
                            </span>
                        </h1>
                        <p className="indexed-fade-rise mx-auto max-w-xl text-base leading-relaxed text-white/60 sm:text-lg md:text-xl" style={{ animationDelay: '0.5s' }}>
                            Fiduciary perspectives on retirement planning, tax optimization,
                            <br className="hidden md:inline" />
                            and wealth building strategies.
                        </p>
                    </div>
                </section>

                {/* ====== FEATURED POST ====== */}
                {featuredPost && (
                    <div className="mx-auto max-w-7xl -mt-8 mb-10 px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="blog-card-animate" style={{ animationDelay: '200ms' }}>
                            <BlogCard post={featuredPost} variant="featured" />
                        </div>
                    </div>
                )}

                {/* ====== CONTENT AREA ====== */}
                <div className="relative">
                    {/* Ambient orbs */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -left-32 top-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.07)_0%,transparent_60%)] blur-[80px]" />
                        <div className="absolute -right-32 top-[30%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(26,77,62,0.05)_0%,transparent_60%)] blur-[60px]" />
                        <div className="absolute bottom-20 left-1/4 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(236,218,118,0.05)_0%,transparent_60%)] blur-[80px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                        {/* ====== TOOLBAR ====== */}
                        <div className="indexed-fade-rise mb-8" style={{ animationDelay: '0.3s' }}>
                            <div className="glass-panel rounded-2xl p-3 sm:p-4">
                                {/* Top row: Filters + Search */}
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    {/* Category Filters */}
                                    <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                                        <SlidersHorizontal className="mr-1 h-4 w-4 flex-shrink-0 text-[#4A5565]/40" />
                                        {STAGE_FILTERS.map((filter) => {
                                            const isActive = filter.value === '' ? !stage : stage === filter.value
                                            const href = buildHref({ stage: filter.value || undefined, sort: sort !== 'newest' ? sort : undefined })
                                            return (
                                                <Link
                                                    key={filter.value}
                                                    href={href}
                                                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ${isActive
                                                        ? filter.activeClass
                                                        : 'text-[#4A5565] hover:bg-white/60 hover:text-[#1A4D3E]'
                                                        }`}
                                                >
                                                    <span className="text-[10px] opacity-60">{filter.icon}</span>
                                                    {filter.label}
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {/* Search + Sort */}
                                    <div className="flex items-center gap-2">
                                        {/* Sort */}
                                        <div className="flex items-center gap-1 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                                            <ArrowUpDown className="ml-3 h-3.5 w-3.5 text-[#4A5565]/50" />
                                            <Link
                                                href={buildHref({ stage: stage || undefined, q: query || undefined, sort: 'newest' })}
                                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${sort === 'newest' ? 'bg-white/70 text-[#1A4D3E] shadow-sm' : 'text-[#4A5565] hover:text-[#1A4D3E]'}`}
                                            >
                                                Newest
                                            </Link>
                                            <Link
                                                href={buildHref({ stage: stage || undefined, q: query || undefined, sort: 'oldest' })}
                                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${sort === 'oldest' ? 'bg-white/70 text-[#1A4D3E] shadow-sm' : 'text-[#4A5565] hover:text-[#1A4D3E]'}`}
                                            >
                                                Oldest
                                            </Link>
                                        </div>

                                        {/* Search */}
                                        <form className="relative w-full min-w-0 md:w-64 lg:w-72">
                                            <input
                                                name="q"
                                                defaultValue={query || ''}
                                                placeholder="Search articles..."
                                                className="w-full rounded-xl border border-white/50 bg-white/40 py-2 pl-9 pr-4 text-sm text-[#1A4D3E] placeholder-[#4A5565]/40 backdrop-blur-sm transition-all focus:border-[#1A4D3E]/30 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#1A4D3E]/10"
                                            />
                                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4A5565]/40" />
                                        </form>
                                    </div>
                                </div>

                                {/* Bottom row: Result count + active filter indicator */}
                                <div className="mt-3 flex items-center justify-between border-t border-white/40 pt-3">
                                    <p className="text-xs text-[#4A5565]/60">
                                        {totalCount > 0 ? (
                                            <>
                                                Showing <span className="font-semibold text-[#1A4D3E]">{showingFrom}&ndash;{showingTo}</span> of{' '}
                                                <span className="font-semibold text-[#1A4D3E]">{totalCount.toLocaleString()}</span> articles
                                            </>
                                        ) : (
                                            'No articles found'
                                        )}
                                    </p>
                                    {hasActiveFilters && (
                                        <Link
                                            href="/blog"
                                            className="text-xs font-medium text-[#1A4D3E]/60 transition-colors hover:text-[#1A4D3E]"
                                        >
                                            Clear all filters
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ====== SPOTLIGHT ROW (2 wide cards) ====== */}
                        {spotlightPosts && spotlightPosts.length > 0 && (
                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                {spotlightPosts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className="blog-card-animate"
                                        style={{ animationDelay: `${300 + index * 100}ms` }}
                                    >
                                        <BlogCard post={post} variant="wide" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ====== STANDARD GRID ====== */}
                        {gridPosts && gridPosts.length > 0 ? (
                            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {gridPosts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className="blog-card-animate"
                                        style={{ animationDelay: `${(isUnfiltered ? 500 : 100) + index * 80}ms` }}
                                    >
                                        <BlogCard post={post} />
                                    </div>
                                ))}
                            </div>
                        ) : !featuredPost && !spotlightPosts?.length ? (
                            <div className="glass-card-light rounded-3xl py-20 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A4D3E]/5">
                                    <Search className="h-7 w-7 text-[#1A4D3E]/30" />
                                </div>
                                <p className="text-lg font-medium text-[#4A5565]">No articles found</p>
                                <p className="mt-1 text-sm text-[#4A5565]/60">Try adjusting your search or filters</p>
                                <Link href="/blog" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1A4D3E] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#10B981]">
                                    View all articles
                                </Link>
                            </div>
                        ) : null}

                        {/* ====== SMART PAGINATION ====== */}
                        {totalPages > 1 && (
                            <nav className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                {/* Page info */}
                                <p className="text-xs text-[#4A5565]/50 order-2 sm:order-1">
                                    Page <span className="font-semibold text-[#1A4D3E]">{page}</span> of{' '}
                                    <span className="font-semibold text-[#1A4D3E]">{totalPages.toLocaleString()}</span>
                                </p>

                                {/* Page controls */}
                                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                                    {/* Previous */}
                                    {page > 1 ? (
                                        <Link
                                            href={buildHref({ page: page - 1, stage: stage || undefined, q: query || undefined, sort })}
                                            className="glass-badge flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-[#1A4D3E] transition-all hover:bg-[#1A4D3E] hover:text-white hover:shadow-lg"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline">Prev</span>
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-xs text-gray-400">
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline">Prev</span>
                                        </span>
                                    )}

                                    {/* Page numbers */}
                                    {pageNumbers.map((item, idx) =>
                                        item === 'ellipsis' ? (
                                            <span key={`e-${idx}`} className="flex h-9 w-9 items-center justify-center text-xs text-[#4A5565]/40">
                                                &hellip;
                                            </span>
                                        ) : (
                                            <Link
                                                key={item}
                                                href={buildHref({ page: item, stage: stage || undefined, q: query || undefined, sort })}
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-medium transition-all duration-200 ${item === page
                                                    ? 'bg-[#1A4D3E] text-white shadow-md shadow-[#1A4D3E]/25'
                                                    : 'glass-badge text-[#4A5565] hover:bg-white/80 hover:text-[#1A4D3E]'
                                                    }`}
                                            >
                                                {item}
                                            </Link>
                                        )
                                    )}

                                    {/* Next */}
                                    {page < totalPages ? (
                                        <Link
                                            href={buildHref({ page: page + 1, stage: stage || undefined, q: query || undefined, sort })}
                                            className="glass-badge flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-[#1A4D3E] transition-all hover:bg-[#1A4D3E] hover:text-white hover:shadow-lg"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-xs text-gray-400">
                                            <span className="hidden sm:inline">Next</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </div>
                            </nav>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
