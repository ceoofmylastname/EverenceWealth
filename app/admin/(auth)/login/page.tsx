'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success('Logged in successfully!')
            router.push('/admin/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#020806]">
            <div className="w-full max-w-md p-8 space-y-8 glass-card rounded-xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-brand-gold uppercase tracking-widest">Admin Login</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to access the Everence Wealth CMS
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold focus:ring-offset-[#020806] disabled:opacity-50 transition-all font-bold tracking-wide"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5 text-[#020806]" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">Don't have an account? </span>
                    <a href="/admin/signup" className="font-medium text-brand-gold hover:text-white transition-colors">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    )
}
