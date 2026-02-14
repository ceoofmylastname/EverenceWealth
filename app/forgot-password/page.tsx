'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)
        try {
            await resetPassword(email)
            setSent(true)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2f1] flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <Link href="/" className="text-[#1A4D3E] text-2xl font-bold tracking-tight">
                        Everence Wealth
                    </Link>
                </div>

                <div className="bg-white p-8 shadow-sm border border-[#4A5565]/10">
                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-[#1A4D3E]/10 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-[#1A4D3E]" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#1A4D3E]">Check your email</h2>
                            <p className="text-[#4A5565] text-sm leading-relaxed">
                                If an account exists for <strong>{email}</strong>, we sent a password reset link.
                                Please check your inbox.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 mt-4 text-[#1A4D3E] font-medium hover:text-[#1A4D3E]/80 text-sm"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-[#1A4D3E]">Reset your password</h2>
                                <p className="text-[#4A5565] text-sm mt-1">
                                    Enter your email and we&apos;ll send you a link to reset your password
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#4A5565] mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 focus:outline-none focus:ring-2 focus:ring-[#1A4D3E] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send reset link'
                                    )}
                                </button>

                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 text-sm text-[#4A5565] hover:text-[#1A4D3E]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to sign in
                                </Link>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
