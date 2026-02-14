'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'

export default function RegisterForm() {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    function validate(): string | null {
        if (!firstName.trim()) return 'First name is required'
        if (!lastName.trim()) return 'Last name is required'
        if (!email.trim()) return 'Email is required'
        if (!password) return 'Password is required'
        if (password.length < 8) return 'Password must be at least 8 characters'
        if (password !== confirmPassword) return 'Passwords do not match'
        if (!acceptTerms) return 'You must accept the terms and conditions'
        return null
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const error = validate()
        if (error) {
            toast.error(error)
            return
        }

        setLoading(true)
        try {
            const data = await signUp(email, password, {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim() || undefined,
            })

            if (data.user && !data.session) {
                setSuccess(true)
            } else if (data.user && data.session) {
                const supabase = createClient()
                await supabase.from('clients').insert({
                    user_id: data.user.id,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim() || null,
                    advisor_id: '00000000-0000-0000-0000-000000000000',
                })
                toast.success('Account created successfully')
                router.push('/portal/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            const message = err?.message || 'Failed to create account'
            if (message.includes('already registered')) {
                toast.error('An account with this email already exists')
            } else {
                toast.error(message)
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#1A4D3E]/10 flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-[#1A4D3E]" />
                </div>
                <h2 className="text-xl font-semibold text-[#1A4D3E]">Check your email</h2>
                <p className="text-[#4A5565] text-sm leading-relaxed">
                    We sent a verification link to <strong>{email}</strong>.
                    Please check your inbox and click the link to verify your account.
                </p>
                <p className="text-[#4A5565]/60 text-xs">
                    Didn&apos;t receive it? Check your spam folder or{' '}
                    <button onClick={() => setSuccess(false)} className="text-[#1A4D3E] underline">
                        try again
                    </button>
                </p>
                <Link
                    href="/login"
                    className="inline-block mt-4 py-3 px-6 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                >
                    Go to sign in
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#4A5565] mb-2">
                        First name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            required
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#4A5565] mb-2">
                        Last name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            required
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-[#4A5565] mb-2">
                    Phone number <span className="text-[#4A5565]/40">(optional)</span>
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
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
                    Confirm password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5565]/50" />
                    <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] focus:ring-1 focus:ring-[#1A4D3E] transition-colors disabled:opacity-50"
                    />
                </div>
                {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 border-[#4A5565]/20 text-[#1A4D3E] focus:ring-[#1A4D3E]"
                />
                <span className="text-sm text-[#4A5565]">
                    I agree to the{' '}
                    <span className="text-[#1A4D3E] underline">Terms of Service</span>{' '}
                    and{' '}
                    <span className="text-[#1A4D3E] underline">Privacy Policy</span>
                </span>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1A4D3E] text-white font-medium hover:bg-[#1A4D3E]/90 focus:outline-none focus:ring-2 focus:ring-[#1A4D3E] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    'Create account'
                )}
            </button>

            <p className="text-center text-sm text-[#4A5565]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#1A4D3E] font-medium hover:text-[#1A4D3E]/80">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
