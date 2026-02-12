import { createClient } from '@/lib/supabase/server'
import { createClient as createBuildClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReadingProgress from '@/components/ReadingProgress'
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'

// Simple client for build-time static generation (no cookies needed)
function getBuildClient() {
    return createBuildClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export const revalidate = 3600

interface BlogPostProps {
    params: { slug: string }
}

const FUNNEL_BADGES: Record<string, { bg: string; text: string; border: string; label: string }> = {
    tofu: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Awareness Stage' },
    mofu: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Consideration Stage' },
    bofu: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Decision Stage' },
}
const DEFAULT_BADGE = { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: 'Blog Post' }

export async function generateStaticParams() {
    const supabase = getBuildClient()
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('status', 'published')

    if (!posts) return []
    return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const supabase = getBuildClient()
    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!post) return { title: 'Post Not Found' }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everencewealth.com'

    return {
        title: `${post.title} | Everence Wealth Blog`,
        description: post.meta_description || undefined,
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.meta_description || undefined,
            type: 'article',
            publishedTime: post.published_at || undefined,
            images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 675 }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.meta_description || undefined,
            images: post.featured_image ? [post.featured_image] : [],
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const supabase = createClient()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single()

    if (!post) {
        notFound()
    }

    // Fetch adjacent posts for prev/next navigation
    const { data: adjacentPosts } = await supabase
        .from('blog_posts')
        .select('slug, title, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    const currentIndex = adjacentPosts?.findIndex(p => p.slug === post.slug) ?? -1
    const nextPost = currentIndex > 0 ? adjacentPosts?.[currentIndex - 1] : null
    const prevPost = currentIndex < (adjacentPosts?.length ?? 0) - 1 ? adjacentPosts?.[currentIndex + 1] : null

    // Fetch related posts from same cluster
    let relatedPosts: { slug: string; title: string; meta_description: string | null; funnel_stage: string | null; featured_image: string | null }[] | null = null
    if (post.cluster_id) {
        const { data } = await supabase
            .from('blog_posts')
            .select('slug, title, meta_description, funnel_stage, featured_image')
            .eq('status', 'published')
            .eq('cluster_id', post.cluster_id)
            .neq('id', post.id)
            .limit(3)
        relatedPosts = data
    }

    const badge = (post.funnel_stage && FUNNEL_BADGES[post.funnel_stage]) || DEFAULT_BADGE
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everencewealth.com'
    const publishedDate = post.published_at ? new Date(post.published_at) : null

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.meta_description,
        image: post.featured_image || undefined,
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
            '@type': 'Organization',
            name: 'Everence Wealth',
            url: siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Everence Wealth',
            url: siteUrl,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${post.slug}`,
        },
        wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : undefined,
        timeRequired: `PT${post.reading_time || 5}M`,
        ...(post.keywords && post.keywords.length > 0 && { keywords: post.keywords.join(', ') }),
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <ReadingProgress />
            <Navbar />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="pb-0 pt-32">
                <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex items-center text-sm font-medium text-gray-400">
                        <Link href="/" className="transition-colors hover:text-[#1A4D3E]">Home</Link>
                        <span className="mx-2.5 text-gray-300">/</span>
                        <Link href="/blog" className="transition-colors hover:text-[#1A4D3E]">Blog</Link>
                        <span className="mx-2.5 text-gray-300">/</span>
                        <span className="max-w-[250px] truncate text-gray-600">{post.title}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <span className={`mb-6 inline-block rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                            {badge.label}
                        </span>

                        <h1 className="mb-6 font-space-grotesk text-4xl font-bold leading-tight text-[#1A4D3E] md:text-5xl lg:text-[56px] lg:leading-[1.1]">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-[#1A4D3E]/40" />
                                Everence Team
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-[#1A4D3E]/40" />
                                {post.reading_time || 5} min read
                            </div>
                            {publishedDate && (
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-[#1A4D3E]/40" />
                                    <time dateTime={post.published_at!}>
                                        {publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </time>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <figure className="mb-16 overflow-hidden rounded-[20px] shadow-[0_20px_60px_rgba(26,77,62,0.12)]">
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={post.featured_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 896px) 100vw, 896px"
                                />
                            </div>
                        </figure>
                    )}

                    {/* Speakable Answer Box */}
                    {post.meta_description && (
                        <div className="speakable-answer relative mb-12 rounded-2xl border-2 border-[#1A4D3E]/20 bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] p-8">
                            <div className="absolute -top-4 left-6 rounded-full bg-white px-3 py-1 text-xl">
                                &#128161;
                            </div>
                            <h2 className="mb-3 mt-1 font-space-grotesk text-lg font-bold text-[#1A4D3E]">
                                Quick Answer
                            </h2>
                            <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-[1.8]">
                                {post.meta_description}
                            </p>
                        </div>
                    )}

                    {/* Main Content */}
                    <div
                        className="blog-prose prose prose-lg mx-auto max-w-none prose-headings:font-space-grotesk prose-headings:font-bold prose-headings:text-[#1A4D3E] prose-h2:mt-12 prose-h2:text-[32px] prose-h3:mt-8 prose-h3:text-2xl prose-p:leading-[1.8] prose-p:text-gray-600 prose-a:font-medium prose-a:text-[#1A4D3E] prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_rgba(26,77,62,0.3)] hover:prose-a:shadow-[inset_0_-2px_0_#1A4D3E] prose-strong:text-[#1A4D3E] prose-blockquote:border-l-4 prose-blockquote:border-[#1A4D3E] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#4A5565] prose-img:rounded-xl prose-img:shadow-lg prose-table:overflow-hidden prose-table:rounded-lg prose-th:bg-[#F9FAFB] prose-th:text-[#1A4D3E] prose-li:marker:text-[#1A4D3E]"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />

                    {/* Keywords / Tags */}
                    {post.keywords && post.keywords.length > 0 && (
                        <div className="mt-16 border-t border-gray-100 pt-8">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {post.keywords.map((keyword: string) => (
                                    <Link
                                        key={keyword}
                                        href={`/blog?q=${encodeURIComponent(keyword)}`}
                                        className="rounded-full bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[#1A4D3E] hover:text-white"
                                    >
                                        {keyword}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-8 text-center font-space-grotesk text-2xl font-bold text-[#1A4D3E] md:text-3xl">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {relatedPosts.map((related: any) => {
                                const relBadge = (related.funnel_stage && FUNNEL_BADGES[related.funnel_stage]) || DEFAULT_BADGE
                                return (
                                    <Link
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className="group rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1A4D3E]/20 hover:shadow-lg"
                                    >
                                        <span className={`mb-3 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${relBadge.bg} ${relBadge.text} ${relBadge.border}`}>
                                            {relBadge.label}
                                        </span>
                                        <h3 className="mb-2 font-space-grotesk text-lg font-bold text-[#1A4D3E] transition-colors group-hover:text-[#2a6b56]">
                                            {related.title}
                                        </h3>
                                        {related.meta_description && (
                                            <p className="line-clamp-2 text-sm text-gray-500">
                                                {related.meta_description}
                                            </p>
                                        )}
                                        <span className="mt-3 inline-flex items-center text-sm font-bold text-[#1A4D3E]">
                                            Read more <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Prev/Next Navigation */}
                <div className="mx-auto mt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 border-t border-gray-200 pt-8 md:grid-cols-2">
                        {prevPost ? (
                            <Link href={`/blog/${prevPost.slug}`} className="group block rounded-2xl border border-gray-100 p-6 text-left transition-all hover:border-[#1A4D3E]/20 hover:shadow-lg">
                                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-[#1A4D3E]">
                                    <ArrowLeft className="h-4 w-4" /> Previous Article
                                </span>
                                <h4 className="line-clamp-2 font-space-grotesk text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1A4D3E]">
                                    {prevPost.title}
                                </h4>
                            </Link>
                        ) : <div />}

                        {nextPost && (
                            <Link href={`/blog/${nextPost.slug}`} className="group block rounded-2xl border border-gray-100 p-6 text-right transition-all hover:border-[#1A4D3E]/20 hover:shadow-lg">
                                <span className="mb-2 flex items-center justify-end gap-2 text-sm font-medium text-gray-400 group-hover:text-[#1A4D3E]">
                                    Next Article <ArrowRight className="h-4 w-4" />
                                </span>
                                <h4 className="line-clamp-2 font-space-grotesk text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1A4D3E]">
                                    {nextPost.title}
                                </h4>
                            </Link>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <section className="relative mt-20 overflow-hidden bg-[#1A4D3E] py-20 text-center">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    </div>
                    <div className="container relative z-10 mx-auto px-4">
                        <h2 className="mb-6 font-space-grotesk text-3xl font-bold text-white md:text-4xl">
                            Ready to Bridge Your Retirement Gap?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-xl text-emerald-100/80">
                            Stop guessing with your financial future. Schedule your comprehensive Financial Needs Assessment today.
                        </p>
                        <Link
                            href="/schedule"
                            className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#ECDA76] px-8 py-4 text-lg font-bold text-[#020806] shadow-xl transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
                        >
                            <span className="relative z-10">Schedule Assessment</span>
                            <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
