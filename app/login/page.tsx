import { Suspense } from 'react'
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'

export const metadata = {
    title: 'Sign In | Everence Wealth',
    description: 'Sign in to your Everence Wealth account.',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#f0f2f1] flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1A4D3E] flex-col justify-between p-12">
                <div>
                    <Link href="/" className="text-white text-2xl font-bold tracking-tight">
                        Everence Wealth
                    </Link>
                </div>
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Bridge the<br />Retirement Gap
                    </h1>
                    <p className="text-white/70 text-lg max-w-md leading-relaxed">
                        Independent fiduciary wealth management with tax-efficient strategies and indexed life insurance.
                    </p>
                </div>
                <p className="text-white/40 text-sm">
                    &copy; {new Date().getFullYear()} Everence Wealth. All rights reserved.
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <Link href="/" className="text-[#1A4D3E] text-2xl font-bold tracking-tight">
                            Everence Wealth
                        </Link>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-[#4A5565]/10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1A4D3E]">Welcome back</h2>
                            <p className="text-[#4A5565] text-sm mt-1">Sign in to your account to continue</p>
                        </div>

                        <Suspense fallback={<div className="h-64 flex items-center justify-center text-[#4A5565]">Loading...</div>}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}
