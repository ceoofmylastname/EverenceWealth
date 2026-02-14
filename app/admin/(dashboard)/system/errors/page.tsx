'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import StatsCard from '@/components/admin/StatsCard'
import {
    AlertTriangle, Bug, CheckCircle, XCircle, Loader2,
    Zap, Shield, Clock, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

type SystemError = Database['public']['Tables']['system_errors']['Row']
type SchemaFix = Database['public']['Tables']['schema_fixes']['Row']
type FilterStatus = 'all' | 'new' | 'analyzed' | 'fixed' | 'ignored'

export default function SystemErrorsPage() {
    const [errors, setErrors] = useState<SystemError[]>([])
    const [fixes, setFixes] = useState<Record<string, SchemaFix[]>>({})
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterStatus>('all')
    const [analyzingId, setAnalyzingId] = useState<string | null>(null)
    const [applyingFixId, setApplyingFixId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchErrors()
        fetchFixes()

        const channel = supabase
            .channel('system-errors-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'system_errors' },
                (payload) => {
                    setErrors(prev => [payload.new as SystemError, ...prev])
                    toast('New error detected', { icon: '🔴' })
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'system_errors' },
                (payload) => {
                    setErrors(prev => prev.map(e =>
                        e.id === (payload.new as SystemError).id ? payload.new as SystemError : e
                    ))
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const fetchErrors = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('system_errors')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) {
            console.error('Error fetching system errors:', error)
        } else {
            setErrors(data || [])
        }
        setLoading(false)
    }

    const fetchFixes = async () => {
        const { data, error } = await supabase
            .from('schema_fixes')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            const grouped: Record<string, SchemaFix[]> = {}
            data.forEach(fix => {
                const eid = fix.error_id || 'unknown'
                if (!grouped[eid]) grouped[eid] = []
                grouped[eid].push(fix)
            })
            setFixes(grouped)
        }
    }

    const handleAnalyze = async (errorId: string) => {
        setAnalyzingId(errorId)
        try {
            const res = await fetch('/api/admin/errors/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorId }),
            })
            const result = await res.json()

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Analysis complete')
                await fetchErrors()
                await fetchFixes()
            }
        } catch (err: any) {
            toast.error('Analysis failed: ' + err.message)
        } finally {
            setAnalyzingId(null)
        }
    }

    const handleApplyFix = async (fixId: string, sqlCommand: string) => {
        const confirmed = confirm(
            `Execute this SQL fix?\n\n${sqlCommand}\n\nThis will modify your database.`
        )
        if (!confirmed) return

        setApplyingFixId(fixId)
        try {
            const res = await fetch('/api/admin/errors/fix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fixId }),
            })
            const result = await res.json()

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Fix applied successfully')
                await fetchErrors()
                await fetchFixes()
            }
        } catch (err: any) {
            toast.error('Fix failed: ' + err.message)
        } finally {
            setApplyingFixId(null)
        }
    }

    const handleIgnore = async (errorId: string) => {
        await supabase
            .from('system_errors')
            .update({ status: 'ignored' })
            .eq('id', errorId)

        setErrors(prev => prev.map(e =>
            e.id === errorId ? { ...e, status: 'ignored' as const } : e
        ))
        toast.success('Error ignored')
    }

    const filteredErrors = filter === 'all'
        ? errors
        : errors.filter(e => e.status === filter)

    const stats = {
        total: errors.length,
        new: errors.filter(e => e.status === 'new').length,
        analyzed: errors.filter(e => e.status === 'analyzed').length,
        fixed: errors.filter(e => e.status === 'fixed').length,
    }

    const getSeverityColor = (severity: string | null) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'error': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'new': return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'analyzed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'fixed': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'ignored': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
            default: return 'bg-gray-500/10 text-gray-400'
        }
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20'
            default: return 'bg-gray-500/10 text-gray-400'
        }
    }

    const filterTabs: { label: string; value: FilterStatus; count: number }[] = [
        { label: 'All', value: 'all', count: errors.length },
        { label: 'New', value: 'new', count: stats.new },
        { label: 'Analyzed', value: 'analyzed', count: stats.analyzed },
        { label: 'Fixed', value: 'fixed', count: stats.fixed },
        { label: 'Ignored', value: 'ignored', count: errors.filter(e => e.status === 'ignored').length },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-brand-gold">System Errors</h2>
                    <p className="mt-1 text-sm text-gray-400">AI-powered error detection and resolution</p>
                </div>
                <button
                    onClick={() => { fetchErrors(); fetchFixes() }}
                    className="inline-flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white hover:bg-white/5 transition-colors"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Errors" value={stats.total} icon={Bug} />
                <StatsCard title="New" value={stats.new} icon={AlertTriangle} />
                <StatsCard title="Analyzed" value={stats.analyzed} icon={Zap} />
                <StatsCard title="Fixed" value={stats.fixed} icon={CheckCircle} />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 pb-4 border-b border-white/10">
                {filterTabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            filter === tab.value
                                ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs opacity-60">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Error Feed */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
                </div>
            ) : filteredErrors.length === 0 ? (
                <div className="text-center py-20 bg-[#0A1210] rounded-xl border border-white/5">
                    <Shield className="h-12 w-12 text-green-500/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No errors found</h3>
                    <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                        {filter === 'all'
                            ? 'Your system is running clean. Errors will appear here automatically when detected.'
                            : `No errors with status "${filter}".`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredErrors.map((error) => {
                        const isExpanded = expandedId === error.id
                        const errorFixes = fixes[error.id] || []
                        const pendingFix = errorFixes.find(f => f.status === 'pending')

                        return (
                            <div
                                key={error.id}
                                className="glass-card rounded-xl border border-white/10 overflow-hidden transition-all hover:border-white/20"
                            >
                                {/* Error Header */}
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : error.id)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getSeverityColor(error.severity)}`}>
                                                    {error.severity}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(error.status)}`}>
                                                    {error.status}
                                                </span>
                                                {error.source && (
                                                    <span className="text-xs text-gray-500 font-mono">{error.source}</span>
                                                )}
                                                <span className="text-xs text-gray-600">
                                                    {error.created_at ? new Date(error.created_at).toLocaleString() : ''}
                                                </span>
                                            </div>
                                            <p className="text-white font-mono text-sm truncate">
                                                {error.error_message}
                                            </p>
                                            {error.error_code && (
                                                <p className="text-gray-500 text-xs mt-1 font-mono">Code: {error.error_code}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {error.status === 'new' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAnalyze(error.id) }}
                                                    disabled={analyzingId !== null}
                                                    className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                                        analyzingId === error.id
                                                            ? 'bg-blue-500/10 text-blue-400 cursor-wait'
                                                            : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 border border-brand-gold/20'
                                                    } ${analyzingId !== null && analyzingId !== error.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {analyzingId === error.id ? (
                                                        <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Analyzing...</>
                                                    ) : (
                                                        <><Zap className="h-3 w-3 mr-1.5" /> Analyze with AI</>
                                                    )}
                                                </button>
                                            )}
                                            {error.status !== 'fixed' && error.status !== 'ignored' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleIgnore(error.id) }}
                                                    className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                                                >
                                                    <XCircle className="h-3 w-3 mr-1.5" /> Ignore
                                                </button>
                                            )}
                                            {isExpanded
                                                ? <ChevronUp className="h-4 w-4 text-gray-500" />
                                                : <ChevronDown className="h-4 w-4 text-gray-500" />
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-white/5 p-6 space-y-5 bg-[#0A1210]/50">
                                        {/* Error Details */}
                                        {error.error_details && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Error Details</h4>
                                                <pre className="font-mono text-xs text-gray-400 bg-[#020806] rounded-lg p-4 overflow-x-auto max-h-40 border border-white/5">
                                                    {JSON.stringify(error.error_details, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {/* AI Analysis */}
                                        {error.ai_analysis && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Analysis</h4>
                                                <div className="bg-[#020806] rounded-lg p-4 border border-white/5">
                                                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{error.ai_analysis}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Suggested SQL Fix */}
                                        {error.suggested_sql && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested SQL Fix</h4>
                                                <pre className="font-mono text-xs text-green-400 bg-[#020806] rounded-lg p-4 overflow-x-auto border border-green-500/10">
                                                    {error.suggested_sql}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Fix Actions */}
                                        {pendingFix && (
                                            <div className="flex items-center justify-between pt-2">
                                                {pendingFix.description && (
                                                    <p className="text-xs text-gray-400">{pendingFix.description}</p>
                                                )}
                                                <button
                                                    onClick={() => handleApplyFix(pendingFix.id, pendingFix.sql_command)}
                                                    disabled={applyingFixId !== null}
                                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                        applyingFixId === pendingFix.id
                                                            ? 'bg-blue-500/10 text-blue-400 cursor-wait'
                                                            : 'bg-brand-gold text-[#020806] hover:bg-brand-gold/90'
                                                    } ${applyingFixId !== null && applyingFixId !== pendingFix.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {applyingFixId === pendingFix.id ? (
                                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Applying...</>
                                                    ) : (
                                                        <><Zap className="h-4 w-4 mr-2" /> Apply Fix</>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Applied Fixes */}
                                        {errorFixes.filter(f => f.status === 'applied').map(fix => (
                                            <div key={fix.id} className="flex items-center gap-2 text-green-500 text-xs">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Fix applied {fix.applied_at ? new Date(fix.applied_at).toLocaleString() : ''}</span>
                                                {fix.result_message && <span className="text-gray-500">— {fix.result_message}</span>}
                                            </div>
                                        ))}

                                        {/* Failed Fixes */}
                                        {errorFixes.filter(f => f.status === 'failed').map(fix => (
                                            <div key={fix.id} className="flex items-center gap-2 text-red-400 text-xs">
                                                <XCircle className="h-3 w-3" />
                                                <span>Fix failed: {fix.result_message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
