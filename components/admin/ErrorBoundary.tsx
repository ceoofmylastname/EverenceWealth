'use client'

import React from 'react'
import { captureError } from '@/lib/error-capture'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
    children: React.ReactNode
    source?: string
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export default class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        captureError(error, {
            source: this.props.source || 'admin.error-boundary',
            severity: 'critical',
            details: {
                componentStack: errorInfo.componentStack,
            },
        })
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[400px] p-8">
                    <div className="glass-card rounded-xl p-8 border border-red-500/20 max-w-lg w-full text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            An unexpected error occurred. This error has been automatically logged for review.
                        </p>
                        {this.state.error && (
                            <div className="bg-[#0A1210] rounded-lg p-4 mb-6 border border-white/5">
                                <p className="text-red-400 text-sm font-mono text-left break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 rounded-md text-sm font-medium text-brand-gold transition-colors"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
