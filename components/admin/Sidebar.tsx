'use client'

import Link from 'next/link'
import { LayoutDashboard, FileText, Share2, CircleHelp, AlertTriangle, Settings, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, disabled: false },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText, disabled: true },
    { name: 'Clusters', href: '/admin/clusters', icon: Share2, disabled: false },
    { name: 'Q&A Pages', href: '/admin/qa', icon: CircleHelp, disabled: true },
    { name: 'System Errors', href: '/admin/system/errors', icon: AlertTriangle, disabled: false },
    { name: 'Settings', href: '/admin/settings', icon: Settings, disabled: false },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    return (
        <div className="flex flex-col w-64 h-screen bg-[#020806] text-white border-r border-white/10 fixed top-0 left-0 overflow-y-auto">
            <div className="flex h-16 items-center px-6 border-b border-white/10">
                <h1 className="text-xl font-bold tracking-wider text-brand-gold">EVERENCE</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.disabled ? '#' : item.href}
                        className={clsx(
                            'flex items-center px-4 py-3 rounded-lg transition-colors group',
                            pathname?.startsWith(item.href)
                                ? 'bg-brand-gold/10 text-brand-gold'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white',
                            item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-400'
                        )}
                        aria-disabled={item.disabled}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
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
}
