'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    UserPlus,
    Users,
    CheckSquare,
    Calendar,
    MessageSquare,
    GraduationCap,
    Settings,
    LogOut,
    X,
} from 'lucide-react'

const sidebarItems = [
    { name: 'Dashboard', href: '/agent/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/agent/leads', icon: UserPlus },
    { name: 'Clients', href: '/agent/clients', icon: Users },
    { name: 'Tasks', href: '/agent/tasks', icon: CheckSquare },
    { name: 'Appointments', href: '/agent/appointments', icon: Calendar },
    { name: 'Messages', href: '/agent/messages', icon: MessageSquare },
    { name: 'Workshops', href: '/agent/workshops', icon: GraduationCap },
    { name: 'Settings', href: '/agent/settings', icon: Settings },
]

interface AgentSidebarProps {
    mobileOpen?: boolean
    onMobileClose?: () => void
}

export default function AgentSidebar({ mobileOpen, onMobileClose }: AgentSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const sidebarContent = (
        <div className="flex flex-col w-64 h-screen bg-[#020806] text-white border-r border-white/10">
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
                <Link href="/agent/dashboard" className="text-xl font-bold tracking-wider text-brand-gold">
                    EVERENCE
                </Link>
                {onMobileClose && (
                    <button onClick={onMobileClose} className="lg:hidden p-1 text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            <div className="px-4 py-3 border-b border-white/10">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent Portal</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname?.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onMobileClose}
                            className={clsx(
                                'flex items-center px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-brand-gold/10 text-brand-gold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Logout</span>
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
