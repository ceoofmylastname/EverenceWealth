'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[Admin Error]', error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="bg-[#0A1210] rounded-xl p-8 border border-red-500/20 max-w-lg w-full text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-gray-400 text-sm mb-4">
                    An error occurred while loading this page.
                </p>
                <div className="bg-[#020806] rounded-lg p-4 mb-6 border border-white/5">
                    <p className="text-red-400 text-sm font-mono text-left break-all">
                        {error.message}
                    </p>
                </div>
                <button
                    onClick={reset}
                    className="inline-flex items-center px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 rounded-md text-sm font-medium text-brand-gold transition-colors"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </button>
            </div>
        </div>
    )
}
