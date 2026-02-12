'use client'

import { Bell, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                setUser({ email: user.email || '' })
            } else {
                router.push('/admin/login')
            }
        }
        fetchUser()
    }, [])

    return (
        <header className="flex h-16 items-center justify-between px-6 bg-[#020806] border-b border-white/10">
            <div className="flex items-center">
                {/* Placeholder for Breadcrumbs or Page Title */}
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-gold ring-2 ring-[#020806]" />
                </button>
                <div className="flex items-center space-x-2 border-l border-white/10 pl-4">
                    <div className="h-8 w-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-sm">
                        {user?.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="text-sm font-medium text-gray-300 hidden md:block">
                        {user?.email || 'Admin'}
                    </div>
                </div>
            </div>
        </header>
    )
}
