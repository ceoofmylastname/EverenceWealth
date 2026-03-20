'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function PortalLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { session } = await signIn(email, password)
            // Ensure client record exists server-side (bypasses RLS)
            const res = await fetch('/api/auth/ensure-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: session.access_token }),
            })
            const result = await res.json()

            if (result.role === 'client') {
                router.push('/portal/dashboard')
            } else if (result.role === 'admin') {
                router.push('/admin/dashboard')
            } else if (result.role === 'advisor') {
                router.push('/agent/dashboard')
            } else {
                // Fallback — still try portal dashboard
                router.push('/portal/dashboard')
            }
        } catch (err: any) {
            toast.error(err?.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2f1] flex">
            {/* Left branding panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1A4D3E] p-12 flex-col justify-between">
                <div>
                    <Link href="/" className="text-white text-2xl font-bold tracking-tight">
                        Everence Wealth
                    </Link>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Your financial future,<br />
                        in clear view.
                    </h1>
                    <p className="text-white/70 mt-4 text-lg max-w-md">
                        Access your policies, track your investments, and connect with your advisor — all in one secure portal.
                    </p>
                </div>
                <p className="text-white/40 text-sm">
                    &copy; {new Date().getFullYear()} Everence Wealth. All rights reserved.
                </p>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <Link href="/" className="text-[#1A4D3E] text-2xl font-bold tracking-tight">
                            Everence Wealth
                        </Link>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-[#4A5565]/10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1A4D3E]">Client Portal</h2>
                            <p className="text-[#4A5565] text-sm mt-1">
                                Sign in to access your account
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

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#4A5565] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                        className="w-full pl-10 pr-12 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5565]/50 hover:text-[#4A5565]"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href="/portal/signup"
                                    className="text-sm text-[#1A4D3E] hover:text-[#1A4D3E]/80 font-medium"
                                >
                                    Create account
                                </Link>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#1A4D3E] hover:text-[#1A4D3E]/80 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 focus:outline-none focus:ring-2 focus:ring-[#1A4D3E] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
