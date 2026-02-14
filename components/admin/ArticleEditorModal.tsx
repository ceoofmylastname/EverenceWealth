'use client'

import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Database } from '@/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface ArticleEditorModalProps {
    post: BlogPost
    open: boolean
    onClose: () => void
    onSaved: (updated: BlogPost) => void
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

export default function ArticleEditorModal({ post, open, onClose, onSaved }: ArticleEditorModalProps) {
    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState(stripHtmlWrapper(post.content || ''))
    const [metaTitle, setMetaTitle] = useState(post.meta_title || '')
    const [metaDescription, setMetaDescription] = useState(post.meta_description || '')
    const [keywords, setKeywords] = useState(post.keywords || '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/articles/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    meta_title: metaTitle || null,
                    meta_description: metaDescription || null,
                    keywords: keywords || null,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to save')

            toast.success('Article saved')
            onSaved(data.article)
        } catch (err: any) {
            toast.error(err.message || 'Failed to save article')
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-stretch justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl bg-[#0A1210] border border-white/10 rounded-none shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                        <h2 className="text-lg font-bold text-white">Edit Article</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-[#020806] border border-white/10 rounded-none px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>

                        {/* Meta Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Title <span className="text-gray-500 text-xs">(SEO)</span>
                            </label>
                            <input
                                type="text"
                                value={metaTitle}
                                onChange={e => setMetaTitle(e.target.value)}
                                placeholder="Custom SEO title (optional)"
                                className="w-full bg-[#020806] border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>

                        {/* Meta Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meta Description <span className="text-gray-500 text-xs">(under 160 chars)</span>
                            </label>
                            <textarea
                                value={metaDescription}
                                onChange={e => setMetaDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-[#020806] border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">{metaDescription.length}/160</p>
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Keywords</label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={e => setKeywords(e.target.value)}
                                placeholder="Comma-separated keywords"
                                className="w-full bg-[#020806] border border-white/10 rounded-none px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content <span className="text-gray-500 text-xs">(HTML)</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={24}
                                className="w-full bg-[#020806] border border-white/10 rounded-none px-4 py-3 text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-y"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-none text-sm font-medium text-gray-300 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-brand-gold hover:bg-brand-gold/90 rounded-none text-sm font-bold text-[#020806] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
