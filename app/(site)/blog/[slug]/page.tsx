import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReadingProgress from '@/components/ReadingProgress'
import { Clock, Calendar, ArrowRight, FileText, Shield, Check, Mic, Building } from 'lucide-react'
import { Metadata } from 'next'
import { blogPostingSchema, breadcrumbSchema, JsonLd } from '@/lib/schema'
import FAQAccordion from '@/components/blog/FAQAccordion'

function getBuildClient() {
    return createServiceClient()
}

export const revalidate = 3600

interface BlogPostProps {
    params: { slug: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

function getBadgeColor(stage: string | null): string {
    switch (stage) {
        case 'tofu':
            return 'border-blue-200 text-blue-700 bg-blue-50'
        case 'mofu':
            return 'border-amber-200 text-amber-700 bg-amber-50'
        case 'bofu':
            return 'border-emerald-200 text-emerald-700 bg-emerald-50'
        default:
            return 'border-gray-200 text-[#4A5565] bg-gray-50'
    }
}

function getBadgeLabel(stage: string | null): string {
    switch (stage) {
        case 'tofu': return 'Awareness'
        case 'mofu': return 'Consideration'
        case 'bofu': return 'Decision'
        default: return 'Article'
    }
}

function stripHtmlWrapper(html: string): string {
    return html
        .replace(/```html\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '')
        .trim()
}

function parseKeywords(keywords: string | null): string[] {
    if (!keywords) return []
    return keywords.split(',').map(k => k.trim()).filter(Boolean)
}

function extractFAQs(content: string): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = []

    // Match H3 questions followed by paragraph answers
    const faqRegex = /<h3[^>]*>(.*?\?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
    let match

    while ((match = faqRegex.exec(content)) !== null) {
        const question = match[1].replace(/<[^>]*>/g, '').trim()
        const answer = match[2].replace(/<[^>]*>/g, '').trim()
        if (question && answer) {
            faqs.push({ question, answer })
        }
    }

    return faqs
}

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

    return {
        title: `${post.meta_title || post.title} | Everence Wealth Blog`,
        description: post.meta_description || post.title,
        keywords: post.keywords || undefined,
        authors: [{ name: 'Everence Wealth' }],
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || undefined,
            type: 'article',
            publishedTime: post.created_at,
            authors: ['Everence Wealth'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.meta_title || post.title,
            description: post.meta_description || undefined,
        },
    }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const supabase = createServiceClient()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single()

    if (!post) {
        notFound()
    }

    // Fetch related posts from same cluster
    let relatedPosts: { id: string; slug: string; title: string; meta_description: string | null; funnel_stage: string | null; reading_time: number | null }[] | null = null
    if (post.cluster_id) {
        const { data } = await supabase
            .from('blog_posts')
            .select('id, slug, title, meta_description, funnel_stage, reading_time')
            .eq('status', 'published')
            .eq('cluster_id', post.cluster_id)
            .neq('id', post.id)
            .order('funnel_position', { ascending: true })
            .limit(3)
        relatedPosts = data
    }

    const createdDate = new Date(post.created_at)
    const keywordsArray = parseKeywords(post.keywords)
    const cleanContent = stripHtmlWrapper(post.content || '')
    const faqs = extractFAQs(cleanContent)

    // JSON-LD structured data
    const jsonLd = blogPostingSchema({
        title: post.title,
        description: post.meta_description,
        slug: post.slug,
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        wordCount: post.word_count,
        readingTime: post.reading_time,
        keywords: keywordsArray.length > 0 ? keywordsArray.join(', ') : null,
        language: post.language || 'en',
    })

    const breadcrumbJsonLd = breadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Blog', url: `${siteUrl}/blog` },
        { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
    ])

    // FAQ Schema
    const faqJsonLd = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null

    // Speakable Schema
    const speakableJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.speakable'],
        },
    }

    return (
        <div className="min-h-screen bg-white">
            <ReadingProgress />
            <Navbar />

            {/* JSON-LD */}
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={speakableJsonLd} />
            {faqJsonLd && <JsonLd data={faqJsonLd} />}

            {/* ====== HERO HEADER ====== */}
            <header className="relative overflow-hidden bg-gradient-to-b from-[#1A4D3E] via-[#1f5e4c] to-emerald-50/50 pb-12 pt-32 md:pt-40">
                {/* Decorative */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-20 top-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_60%)] blur-[60px]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-8">
                        <ol className="flex items-center gap-2 text-sm text-white/60">
                            <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
                            <li>&rarr;</li>
                            <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
                            <li>&rarr;</li>
                            <li>
                                <Link href={`/blog?stage=${post.funnel_stage}`} className="capitalize transition-colors hover:text-white">
                                    {getBadgeLabel(post.funnel_stage)}
                                </Link>
                            </li>
                        </ol>
                    </nav>

                    {/* Funnel Badge */}
                    <div className="mb-5">
                        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                            {getBadgeLabel(post.funnel_stage)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 font-space-grotesk text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A4D3E]/70 md:gap-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.reading_time || 5} min read</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{(post.word_count || 0).toLocaleString()} words</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.created_at}>
                                {createdDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A4D3E]/10">
                            <Building className="h-5 w-5 text-[#1A4D3E]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#1A4D3E]">Everence Wealth Team</p>
                            <p className="text-xs text-[#4A5565]">Fiduciary Wealth Strategists</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative pb-0">
                {/* ====== SPEAKABLE ANSWER BOX (AEO) ====== */}
                {post.meta_description && (
                    <div className="mx-auto max-w-4xl px-6 -mt-6 mb-12 relative z-10">
                        <div className="relative rounded-xl border border-[#1A4D3E]/15 bg-white p-6 shadow-xl shadow-[#1A4D3E]/5 md:p-8">
                            {/* Left accent bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-[#1A4D3E] to-[#10B981]" />

                            {/* Label */}
                            <div className="absolute -top-3 left-6">
                                <span className="rounded-full bg-[#1A4D3E] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                                    Quick Answer
                                </span>
                            </div>

                            {/* Speakable Content */}
                            <div className="speakable mt-2" itemProp="speakable">
                                <p className="text-lg leading-relaxed text-[#1A4D3E] md:text-xl">
                                    {post.meta_description}
                                </p>
                            </div>

                            {/* Voice indicator */}
                            <div className="mt-4 flex items-center gap-2 text-sm text-[#4A5565]/60">
                                <Mic className="h-4 w-4" />
                                <span>Optimized for voice assistants</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== ARTICLE CONTENT ====== */}
                <article className="mx-auto max-w-4xl px-6 py-8">
                    <div
                        className="blog-prose prose prose-lg max-w-none
                            prose-headings:text-[#1A4D3E]
                            prose-h2:text-3xl prose-h2:font-bold prose-h2:text-[#1A4D3E] prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-0
                            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-[#1A4D3E] prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-[#4A5565] prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-[#1A4D3E] prose-a:font-semibold prose-a:no-underline prose-a:border-b prose-a:border-[#1A4D3E]/30 hover:prose-a:border-[#1A4D3E] prose-a:transition-colors
                            prose-strong:text-[#1A4D3E] prose-strong:font-semibold
                            prose-ul:my-6 prose-ul:pl-6
                            prose-ol:my-6 prose-ol:pl-6
                            prose-li:text-[#4A5565] prose-li:mb-2 prose-li:marker:text-[#1A4D3E]
                            prose-blockquote:border-l-4 prose-blockquote:border-[#1A4D3E] prose-blockquote:bg-emerald-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:not-italic prose-blockquote:text-[#4A5565] prose-blockquote:rounded-r-lg
                            prose-code:text-[#1A4D3E] prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-[#1A4D3E] prose-pre:text-white prose-pre:rounded-xl
                            prose-table:overflow-hidden prose-table:rounded-xl prose-th:bg-emerald-50 prose-th:text-[#1A4D3E]
                            prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />

                    {/* Keywords / Tags */}
                    {keywordsArray.length > 0 && (
                        <div className="mt-16 border-t border-[#1A4D3E]/10 pt-8">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#4A5565]/60">Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywordsArray.map((keyword) => (
                                    <Link
                                        key={keyword}
                                        href={`/blog?q=${encodeURIComponent(keyword)}`}
                                        className="rounded-full border border-[#1A4D3E]/15 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium text-[#1A4D3E] transition-colors hover:bg-[#1A4D3E] hover:text-white"
                                    >
                                        {keyword}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* ====== FAQ ACCORDION ====== */}
                {faqs.length > 0 && (
                    <section className="mx-auto max-w-4xl px-6 my-16">
                        <h2 className="mb-8 font-space-grotesk text-3xl font-bold text-[#1A4D3E]">Frequently Asked Questions</h2>
                        <FAQAccordion faqs={faqs} />
                    </section>
                )}

                {/* ====== RELATED ARTICLES ====== */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <section className="mx-auto max-w-4xl px-6 my-16 border-t border-[#1A4D3E]/10 pt-12">
                        <h2 className="mb-2 font-space-grotesk text-3xl font-bold text-[#1A4D3E]">Continue Your Journey</h2>
                        <p className="mb-8 text-[#4A5565]">Explore related strategies and frameworks</p>

                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className="group rounded-xl border border-[#1A4D3E]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#1A4D3E]/10 hover:-translate-y-1"
                                >
                                    <span className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getBadgeColor(related.funnel_stage)}`}>
                                        {getBadgeLabel(related.funnel_stage)}
                                    </span>

                                    <h3 className="mb-3 text-lg font-semibold text-[#1A4D3E] transition-colors group-hover:text-[#10B981] line-clamp-2">
                                        {related.title}
                                    </h3>

                                    <div className="mb-4 flex items-center gap-2 text-sm text-[#4A5565]/60">
                                        <Clock className="h-4 w-4" />
                                        <span>{related.reading_time || 5} min read</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A4D3E] transition-all group-hover:gap-3">
                                        Read Article <ArrowRight className="h-4 w-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ====== FIDUCIARY CREDIBILITY BOX ====== */}
                <aside className="mx-auto max-w-4xl px-6 my-16">
                    <div className="rounded-2xl border border-[#1A4D3E]/15 bg-gradient-to-br from-emerald-50/50 to-white p-8 shadow-sm">
                        <div className="flex flex-col items-start gap-6 md:flex-row">
                            <div className="flex-shrink-0">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1A4D3E] shadow-lg shadow-[#1A4D3E]/20">
                                    <Shield className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                                        Fiduciary
                                    </span>
                                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                                        Independent Broker
                                    </span>
                                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                                        75+ Carriers
                                    </span>
                                </div>

                                <h3 className="mb-3 text-2xl font-bold text-[#1A4D3E]">Everence Wealth</h3>

                                <p className="mb-4 leading-relaxed text-[#4A5565]">
                                    As an independent fiduciary firm with access to 75+ insurance carriers, we work exclusively
                                    in your best interest—not for banks or Wall Street. Our contrarian approach focuses on
                                    cash flow over net worth, tax-free wealth building, and exposing hidden financial inefficiencies.
                                </p>

                                <div className="mb-6 space-y-2">
                                    <div className="flex items-start gap-2 text-sm text-[#4A5565]">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1A4D3E]" />
                                        <span>Licensed Independent Broker</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-[#4A5565]">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1A4D3E]" />
                                        <span>Fiduciary Standard of Care</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-[#4A5565]">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1A4D3E]" />
                                        <span>San Francisco, CA | Serving Nationwide</span>
                                    </div>
                                </div>

                                <Link
                                    href="/#contact"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#1A4D3E] px-6 py-3 font-semibold text-white transition-all hover:bg-[#10B981] hover:shadow-lg hover:shadow-[#1A4D3E]/20"
                                >
                                    Schedule Financial Needs Assessment
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ====== PRIMARY CTA ====== */}
                <section className="mx-auto max-w-4xl px-6 my-16">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A4D3E] via-[#1f5e4c] to-[#10B981] p-12 shadow-xl shadow-[#1A4D3E]/20">
                        {/* Dot pattern */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.05]"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }}
                        />

                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h2 className="mb-4 font-space-grotesk text-3xl font-bold text-white md:text-4xl">
                                Ready to Build Tax-Free Wealth?
                            </h2>
                            <p className="mb-8 text-xl leading-relaxed text-white/80">
                                Schedule a Financial Needs Assessment to stress-test your current strategy
                                against fees, volatility, and taxes.
                            </p>

                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/#contact"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[#1A4D3E] transition-all hover:shadow-xl hover:shadow-white/20 hover:scale-105"
                                >
                                    Schedule Assessment
                                    <Calendar className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="/philosophy"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                                >
                                    Learn Our Philosophy
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>

                            <p className="mt-6 text-sm text-white/50">
                                No obligation. Fiduciary standard guaranteed.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
