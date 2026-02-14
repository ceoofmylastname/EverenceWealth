'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updatePassword } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            await updatePassword(password)
            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update password')
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
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-[#1A4D3E]/10 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-[#1A4D3E]" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#1A4D3E]">Password updated</h2>
                            <p className="text-[#4A5565] text-sm">
                                Your password has been reset successfully. Redirecting to sign in...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-[#1A4D3E]">Set new password</h2>
                                <p className="text-[#4A5565] text-sm mt-1">
                                    Enter your new password below
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-[#4A5565] mb-2">
                                        New password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            required
                                            minLength={8}
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
                                    {password && password.length < 8 && (
                                        <p className="mt-1 text-xs text-red-500">Password must be at least 8 characters</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4A5565] mb-2">
                                        Confirm new password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                                        <input
                                            id="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your new password"
                                            required
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 focus:outline-none focus:ring-2 focus:ring-[#1A4D3E] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update password'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
