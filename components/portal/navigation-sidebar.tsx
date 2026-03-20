'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    Shield,
    Wallet,
    FileText,
    UserCircle,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    X,
} from 'lucide-react'

const sidebarItems = [
    { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'My Coverage', href: '/portal/coverage', icon: Shield },
    { name: 'My Accounts', href: '/portal/accounts', icon: Wallet },
    { name: 'Documents', href: '/portal/documents', icon: FileText },
    { name: 'My Advisor', href: '/portal/advisor', icon: UserCircle },
    { name: 'Messages', href: '/portal/messages', icon: MessageSquare },
    { name: 'Appointments', href: '/portal/appointments', icon: Calendar },
    { name: 'Settings', href: '/portal/settings', icon: Settings },
]

interface NavigationSidebarProps {
    unreadCount?: number
    mobileOpen?: boolean
    onMobileClose?: () => void
}

export default function NavigationSidebar({ unreadCount = 0, mobileOpen, onMobileClose }: NavigationSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const sidebarContent = (
        <div className="flex flex-col w-64 h-screen bg-white border-r border-[#4A5565]/10">
            <div className="flex h-16 items-center justify-between px-6 border-b border-[#4A5565]/10">
                <Link href="/" className="text-lg font-bold tracking-tight text-[#1A4D3E]">
                    Everence Wealth
                </Link>
                {onMobileClose && (
                    <button onClick={onMobileClose} className="lg:hidden p-1 text-[#4A5565] hover:text-[#1A4D3E]">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname?.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onMobileClose}
                            className={clsx(
                                'flex items-center px-4 py-3 text-sm font-medium transition-colors relative',
                                isActive
                                    ? 'bg-[#1A4D3E]/5 text-[#1A4D3E] border-r-2 border-[#1A4D3E]'
                                    : 'text-[#4A5565] hover:bg-[#f0f2f1] hover:text-[#1A4D3E]'
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span>{item.name}</span>
                            {item.name === 'Messages' && unreadCount > 0 && (
                                <span className="ml-auto bg-[#1A4D3E] text-white text-xs font-bold px-2 py-0.5 min-w-[20px] text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-3 border-t border-[#4A5565]/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-[#4A5565] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign out</span>
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:block fixed top-0 left-0 z-40">
                {sidebarContent}
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
                    <div className="relative z-10">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    )
}
