import { createClient } from '@/lib/supabase/server'
import BlogCard from './BlogCard'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default async function BlogSection() {
    const supabase = createClient()

    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)

    if (!posts || posts.length === 0) return null

    const featuredPost = posts[0]
    const otherPosts = posts.slice(1, 3)

    return (
        <section className="relative overflow-hidden bg-white py-24 md:py-32 lg:py-40">
            {/* Subtle background gradient */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#1A4D3E]/[0.03] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-[#F9FAFB]/50 to-transparent" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1400px]">
                {/* Section Header */}
                <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="scroll-reveal">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A4D3E]/60">
                            Insights & Strategies
                        </p>
                        <h2 className="mb-4 font-space-grotesk text-4xl font-bold tracking-tight text-[#1A4D3E] md:text-5xl lg:text-[48px]">
                            Latest from Our Blog
                        </h2>
                        <p className="max-w-2xl font-sans text-lg text-[#4A5565] md:text-xl">
                            Straight talk on wealth, taxes, and financial freedom. Actionable strategies, no jargon.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="scroll-reveal group inline-flex items-center whitespace-nowrap rounded-full border border-[#1A4D3E]/20 px-7 py-3.5 text-sm font-bold tracking-wide text-[#1A4D3E] transition-all duration-300 hover:border-[#1A4D3E] hover:bg-[#1A4D3E] hover:text-white hover:shadow-lg"
                    >
                        View All Articles
                        <ArrowUpRight className="ml-2 h-4 w-4 transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Featured Post */}
                    <div className="scroll-reveal w-full">
                        <BlogCard post={featuredPost} featured={true} />
                    </div>

                    {/* Secondary Posts */}
                    {otherPosts.length > 0 && (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {otherPosts.map((post, index) => (
                                <div key={post.id} className="scroll-reveal" style={{ transitionDelay: `${(index + 1) * 150}ms` }}>
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
