'use client'

import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'

interface AgentHeaderProps {
    onMenuToggle: () => void
}

export default function AgentHeader({ onMenuToggle }: AgentHeaderProps) {
    const { user } = useAuth()
    const initial = user?.user_metadata?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'
    const displayName = user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
        : user?.email || 'Agent'

    return (
        <header className="flex h-16 items-center justify-between px-6 bg-[#020806] border-b border-white/10 sticky top-0 z-30">
            <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                    <div className="h-8 w-8 bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-sm rounded-lg">
                        {initial}
                    </div>
                    <span className="text-sm font-medium text-white hidden md:block">
                        {displayName}
                    </span>
                </div>
            </div>
        </header>
    )
}
