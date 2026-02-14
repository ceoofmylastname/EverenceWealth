'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface CreateClusterDialogProps {
    open: boolean
    onClose: () => void
    onComplete: () => void
}

type DialogState = 'idle' | 'submitting' | 'generating' | 'complete' | 'error'

interface GenerationProgress {
    status: string
    completed_articles: number
    total_articles: number
    error_message: string | null
}

export default function CreateClusterDialog({ open, onClose, onComplete }: CreateClusterDialogProps) {
    const [state, setState] = useState<DialogState>('idle')
    const [topic, setTopic] = useState('')
    const [primaryKeyword, setPrimaryKeyword] = useState('')
    const [targetAudience, setTargetAudience] = useState('')
    const [progress, setProgress] = useState<GenerationProgress>({ status: 'pending', completed_articles: 0, total_articles: 6, error_message: null })
    const [errorMsg, setErrorMsg] = useState('')
    const [generationId, setGenerationId] = useState<string | null>(null)
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const supabase = createClient()

    // Realtime subscription + fallback polling
    useEffect(() => {
        if (!generationId || state !== 'generating') return

        // Subscribe to realtime updates
        const channel = supabase
            .channel(`generation-${generationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'cluster_generations',
                    filter: `id=eq.${generationId}`,
                },
                (payload) => {
                    const row = payload.new as GenerationProgress
                    setProgress(row)
                    handleStatusChange(row)
                }
            )
            .subscribe()

        // Fallback polling every 5s
        pollIntervalRef.current = setInterval(async () => {
            const { data } = await supabase
                .from('cluster_generations')
                .select('status, completed_articles, total_articles, error_message')
                .eq('id', generationId)
                .single()

            if (data) {
                setProgress(data)
                handleStatusChange(data)
            }
        }, 5000)

        return () => {
            supabase.removeChannel(channel)
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        }
    }, [generationId, state])

    const handleStatusChange = (row: GenerationProgress) => {
        if (row.status === 'completed') {
            setState('complete')
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
            toast.success('Cluster generated successfully!')
        } else if (row.status === 'failed') {
            setState('error')
            setErrorMsg(row.error_message || 'Generation failed')
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
            toast.error(row.error_message || 'Generation failed')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!topic || !primaryKeyword || !targetAudience) return

        setState('submitting')
        setErrorMsg('')

        try {
            const res = await fetch('/api/clusters/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    primary_keyword: primaryKeyword,
                    target_audience: targetAudience,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to start generation')

            setGenerationId(data.generation_id)
            setState('generating')
        } catch (err: any) {
            setState('error')
            setErrorMsg(err.message || 'Failed to start generation')
            toast.error(err.message || 'Failed to start generation')
        }
    }

    const handleClose = () => {
        if (state === 'generating') return // Don't close while generating
        if (state === 'complete') onComplete()
        setState('idle')
        setTopic('')
        setPrimaryKeyword('')
        setTargetAudience('')
        setProgress({ status: 'pending', completed_articles: 0, total_articles: 6, error_message: null })
        setGenerationId(null)
        setErrorMsg('')
        onClose()
    }

    const handleDone = () => {
        onComplete()
        handleClose()
    }

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={state !== 'generating' ? handleClose : undefined} />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#0A1210] border border-white/10 rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-brand-gold" />
                            <h2 className="text-lg font-bold text-white">Create New Cluster</h2>
                        </div>
                        {state !== 'generating' && (
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {state === 'idle' || state === 'submitting' ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Cluster Topic *
                                    </label>
                                    <textarea
                                        required
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Indexed Universal Life Insurance Strategy"
                                        rows={2}
                                        className="w-full bg-[#020806] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Primary Keyword *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={primaryKeyword}
                                        onChange={(e) => setPrimaryKeyword(e.target.value)}
                                        placeholder="e.g., indexed universal life insurance"
                                        className="w-full bg-[#020806] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target Audience *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="e.g., High-income professionals aged 35-55"
                                        className="w-full bg-[#020806] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={state === 'submitting'}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={state === 'submitting'}
                                        className="flex-1 px-4 py-3 bg-brand-gold hover:bg-brand-gold/90 rounded-lg text-sm font-bold text-[#020806] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {state === 'submitting' ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Starting...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4" />
                                                Generate Cluster
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : state === 'generating' ? (
                            <div className="space-y-6 py-4">
                                <div className="text-center">
                                    <Loader2 className="h-10 w-10 animate-spin text-brand-gold mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-white">Generating Content</h3>
                                    <p className="text-sm text-gray-400 mt-1">AI is writing {progress.total_articles} articles for your cluster...</p>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Progress</span>
                                        <span className="text-brand-gold font-bold">
                                            {progress.completed_articles}/{progress.total_articles}
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-[#020806] rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-gold/60 to-brand-gold transition-all duration-700 ease-out"
                                            style={{ width: `${(progress.completed_articles / progress.total_articles) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Funnel stage breakdown */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-[#020806] rounded-lg border border-white/5">
                                        <div className="text-xs text-blue-400 font-semibold mb-1">TOFU</div>
                                        <div className="text-lg font-bold text-white">
                                            {Math.min(progress.completed_articles, 3)}/3
                                        </div>
                                        <div className="text-xs text-gray-500">Awareness</div>
                                    </div>
                                    <div className="text-center p-3 bg-[#020806] rounded-lg border border-white/5">
                                        <div className="text-xs text-yellow-400 font-semibold mb-1">MOFU</div>
                                        <div className="text-lg font-bold text-white">
                                            {Math.max(0, Math.min(progress.completed_articles - 3, 2))}/2
                                        </div>
                                        <div className="text-xs text-gray-500">Consideration</div>
                                    </div>
                                    <div className="text-center p-3 bg-[#020806] rounded-lg border border-white/5">
                                        <div className="text-xs text-green-400 font-semibold mb-1">BOFU</div>
                                        <div className="text-lg font-bold text-white">
                                            {Math.max(0, Math.min(progress.completed_articles - 5, 1))}/1
                                        </div>
                                        <div className="text-xs text-gray-500">Decision</div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    This usually takes 1-3 minutes. Do not close this dialog.
                                </p>
                            </div>
                        ) : state === 'complete' ? (
                            <div className="text-center py-8 space-y-4">
                                <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Cluster Generated!</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        All {progress.total_articles} articles have been generated and are ready for review.
                                    </p>
                                </div>
                                <button
                                    onClick={handleDone}
                                    className="px-6 py-3 bg-brand-gold hover:bg-brand-gold/90 rounded-lg text-sm font-bold text-[#020806] transition-colors"
                                >
                                    View Cluster
                                </button>
                            </div>
                        ) : state === 'error' ? (
                            <div className="text-center py-8 space-y-4">
                                <AlertCircle className="h-14 w-14 text-red-500 mx-auto" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Generation Failed</h3>
                                    <p className="text-sm text-red-400 mt-2 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                        {errorMsg}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => { setState('idle'); setErrorMsg('') }}
                                        className="flex-1 px-4 py-3 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 rounded-lg text-sm font-medium text-brand-gold transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    )
}
