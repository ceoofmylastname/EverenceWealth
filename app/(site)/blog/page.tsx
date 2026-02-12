import { createClient } from '@/lib/supabase/server'
import BlogCard from '@/components/BlogCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
    title: 'Blog | Everence Wealth',
    description: 'Straight talk on wealth, taxes, and retirement. Actionable strategies for your financial future from Everence Wealth.',
    openGraph: {
        title: 'Blog | Everence Wealth',
        description: 'Straight talk on wealth, taxes, and retirement. Actionable strategies for your financial future.',
    }
}

const STAGE_FILTERS = [
    { value: '', label: 'All Topics', activeClass: 'bg-[#ECDA76] text-[#020806]' },
    { value: 'tofu', label: 'Awareness', activeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { value: 'mofu', label: 'Consideration', activeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { value: 'bofu', label: 'Decision', activeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
]

export default async function BlogPage({
    searchParams
}: {
    searchParams: { page?: string, stage?: string, q?: string }
}) {
    const supabase = createClient()
    const page = Number(searchParams.page) || 1
    const pageSize = 9
    const stage = searchParams.stage
    const query = searchParams.q

    let dbQuery = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (stage && ['tofu', 'mofu', 'bofu'].includes(stage)) {
        dbQuery = dbQuery.eq('funnel_stage', stage)
    }

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: posts, count } = await dbQuery.range(from, to)
    const totalPages = count ? Math.ceil(count / pageSize) : 0

    return (
        <div className="flex min-h-screen flex-col bg-[#020806]">
            <Navbar />

            <main className="flex-grow pb-24 pt-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#ECDA76]/60">
                            Insights & Strategies
                        </p>
                        <h1 className="mb-6 font-space-grotesk text-5xl font-bold text-[#ECDA76] md:text-6xl">
                            Everence Wealth Blog
                        </h1>
                        <p className="text-xl text-gray-400">
                            Straight talk on wealth, taxes, and retirement.{' '}
                            <br className="hidden md:inline" />
                            No jargon, just actionable strategies for your financial future.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="mb-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:flex-row">
                        {/* Filter Buttons */}
                        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
                            {STAGE_FILTERS.map((filter) => {
                                const isActive = filter.value === '' ? !stage : stage === filter.value
                                const href = filter.value ? `/blog?stage=${filter.value}` : '/blog'
                                return (
                                    <Link
                                        key={filter.value}
                                        href={href}
                                        className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                                            ? filter.activeClass
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {filter.label}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Search */}
                        <form className="relative w-full md:w-80">
                            <input
                                name="q"
                                defaultValue={query || ''}
                                placeholder="Search articles..."
                                className="w-full rounded-xl border border-white/10 bg-[#020806] py-2.5 pl-10 pr-4 text-white placeholder-gray-600 transition-colors focus:border-[#ECDA76] focus:outline-none focus:ring-1 focus:ring-[#ECDA76]"
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        </form>
                    </div>

                    {/* Posts Grid */}
                    {posts && posts.length > 0 ? (
                        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="blog-card-animate"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
                            <p className="text-lg text-gray-400">No articles found matching your criteria.</p>
                            <Link href="/blog" className="mt-4 inline-block text-[#ECDA76] hover:underline">
                                Clear filters
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3">
                            {page > 1 ? (
                                <Link
                                    href={`/blog?page=${page - 1}${stage ? `&stage=${stage}` : ''}${query ? `&q=${query}` : ''}`}
                                    className="rounded-full border border-white/10 p-2.5 text-white transition-colors hover:bg-white/10"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-full border border-white/10 p-2.5 text-gray-600">
                                    <ChevronLeft className="h-5 w-5" />
                                </span>
                            )}

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Link
                                    key={pageNum}
                                    href={`/blog?page=${pageNum}${stage ? `&stage=${stage}` : ''}${query ? `&q=${query}` : ''}`}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${pageNum === page
                                        ? 'bg-[#ECDA76] text-[#020806]'
                                        : 'border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {pageNum}
                                </Link>
                            ))}

                            {page < totalPages ? (
                                <Link
                                    href={`/blog?page=${page + 1}${stage ? `&stage=${stage}` : ''}${query ? `&q=${query}` : ''}`}
                                    className="rounded-full border border-white/10 p-2.5 text-white transition-colors hover:bg-white/10"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-full border border-white/10 p-2.5 text-gray-600">
                                    <ChevronRight className="h-5 w-5" />
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
