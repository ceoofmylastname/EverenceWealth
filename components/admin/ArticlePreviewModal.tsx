'use client'

import { X, Clock, FileText } from 'lucide-react'
import { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface ArticlePreviewModalProps {
    post: BlogPost
    open: boolean
    onClose: () => void
}

const FUNNEL_BADGES: Record<string, { bg: string; text: string; label: string }> = {
    tofu: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Awareness Stage' },
    mofu: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Consideration Stage' },
    bofu: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Decision Stage' },
}
const DEFAULT_BADGE = { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Blog Post' }

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

export default function ArticlePreviewModal({ post, open, onClose }: ArticlePreviewModalProps) {
    if (!open) return null

    const badge = (post.funnel_stage && FUNNEL_BADGES[post.funnel_stage]) || DEFAULT_BADGE
    const cleanContent = stripHtmlWrapper(post.content || '')

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-stretch justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl bg-white shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Preview Header */}
                    <div className="flex items-center justify-between px-6 py-3 bg-[#020806] border-b border-white/10 flex-shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Article Preview</span>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Article Preview */}
                    <div className="flex-1 overflow-y-auto">
                        <article className="mx-auto max-w-3xl px-8 py-12">
                            {/* Badge */}
                            <span className={`mb-6 inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                {badge.label}
                            </span>

                            {/* Title */}
                            <h1 className="mb-6 font-space-grotesk text-4xl font-bold leading-tight text-[#1A4D3E] md:text-5xl">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-[#1A4D3E]/40" />
                                    {post.reading_time || 5} min read
                                </span>
                                <span className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-[#1A4D3E]/40" />
                                    {post.word_count || 0} words
                                </span>
                            </div>

                            {/* Quick Answer */}
                            {post.meta_description && (
                                <div className="mb-10 rounded-2xl border-2 border-[#1A4D3E]/20 bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] p-8">
                                    <h2 className="mb-3 font-space-grotesk text-lg font-bold text-[#1A4D3E]">Quick Answer</h2>
                                    <p className="text-base leading-relaxed text-gray-700">{post.meta_description}</p>
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-space-grotesk prose-headings:font-bold prose-headings:text-[#1A4D3E] prose-h2:mt-10 prose-h2:text-[28px] prose-h3:mt-8 prose-h3:text-xl prose-p:leading-[1.8] prose-p:text-gray-600 prose-a:text-[#1A4D3E] prose-strong:text-[#1A4D3E] prose-blockquote:border-l-4 prose-blockquote:border-[#1A4D3E] prose-li:marker:text-[#1A4D3E]"
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />

                            {/* CTA */}
                            <div className="mt-12 rounded-2xl bg-[#1A4D3E] p-8 text-center">
                                <h2 className="mb-3 font-space-grotesk text-2xl font-bold text-white">
                                    Ready to Bridge Your Retirement Gap?
                                </h2>
                                <p className="mb-6 text-emerald-100/80">
                                    Schedule your comprehensive Financial Needs Assessment today.
                                </p>
                                <span className="inline-block rounded-full bg-[#ECDA76] px-8 py-3 text-sm font-bold text-[#020806]">
                                    Schedule Assessment
                                </span>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}
