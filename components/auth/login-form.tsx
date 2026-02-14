'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, detectRoleClient, getRoleDashboard } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)

    const verified = searchParams.get('verified')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const data = await signIn(email, password)
            if (data.user) {
                const role = await detectRoleClient(data.user.id)
                const dashboard = getRoleDashboard(role)
                toast.success('Signed in successfully')
                router.push(dashboard)
                router.refresh()
            }
        } catch (err: any) {
            const message = err?.message || 'Failed to sign in'
            if (message.includes('Invalid login credentials')) {
                toast.error('Invalid email or password')
            } else if (message.includes('Email not confirmed')) {
                toast.error('Please verify your email before signing in')
            } else {
                toast.error(message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {verified === 'true' && (
                <div className="bg-[#1A4D3E]/10 border border-[#1A4D3E]/20 p-4 text-[#1A4D3E] text-sm">
                    Email verified successfully. You can now sign in.
                </div>
            )}

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
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border-[#4A5565]/20 text-[#1A4D3E] focus:ring-[#1A4D3E]"
                    />
                    <span className="text-sm text-[#4A5565]">Remember me</span>
                </label>
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

            <p className="text-center text-sm text-[#4A5565]">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#1A4D3E] font-medium hover:text-[#1A4D3E]/80">
                    Create account
                </Link>
            </p>
        </form>
    )
}
