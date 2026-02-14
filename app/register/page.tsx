import Link from 'next/link'
import RegisterForm from '@/components/auth/register-form'

export const metadata = {
    title: 'Create Account | Everence Wealth',
    description: 'Create your Everence Wealth account to access your client portal.',
}

export default function RegisterPage() {
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
                        Start your journey<br />to financial freedom
                    </h1>
                    <p className="text-white/70 text-lg max-w-md leading-relaxed">
                        Create your account to access personalized wealth management strategies, schedule consultations, and track your financial progress.
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
                            <h2 className="text-2xl font-bold text-[#1A4D3E]">Create your account</h2>
                            <p className="text-[#4A5565] text-sm mt-1">Get started with Everence Wealth</p>
                        </div>

                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
