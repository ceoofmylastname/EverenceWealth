'use client'

import { useEffect } from 'react'

export default function PortalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Portal error:', error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md space-y-4">
                <h2 className="text-xl font-bold text-[#1A4D3E]">Something went wrong</h2>
                <p className="text-sm text-[#4A5565]">
                    {error.message || 'An unexpected error occurred while loading this page.'}
                </p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
