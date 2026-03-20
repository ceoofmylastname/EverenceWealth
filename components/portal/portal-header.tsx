'use client'

import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'

interface PortalHeaderProps {
    onMenuToggle: () => void
    unreadCount?: number
}

export default function PortalHeader({ onMenuToggle, unreadCount = 0 }: PortalHeaderProps) {
    const { user } = useAuth()
    const initial = user?.user_metadata?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'C'
    const displayName = user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
        : user?.email || 'Client'

    return (
        <header className="flex h-16 items-center justify-between px-6 bg-white border-b border-[#4A5565]/10 sticky top-0 z-30">
            <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 text-[#4A5565] hover:text-[#1A4D3E] hover:bg-[#f0f2f1] transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-[#4A5565] hover:text-[#1A4D3E] hover:bg-[#f0f2f1] transition-colors">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 bg-[#1A4D3E]" />
                    )}
                </button>
                <div className="flex items-center space-x-3 border-l border-[#4A5565]/10 pl-4">
                    <div className="h-8 w-8 bg-[#1A4D3E]/10 flex items-center justify-center text-[#1A4D3E] font-bold text-sm">
                        {initial}
                    </div>
                    <span className="text-sm font-medium text-[#1A4D3E] hidden md:block">
                        {displayName}
                    </span>
                </div>
            </div>
        </header>
    )
}
