'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2 } from 'lucide-react'
import type { UserRole } from '@/lib/auth'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, role, loading, initialized, dashboardUrl } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!initialized) return

        if (!user) {
            router.replace('/login')
            return
        }

        if (role && !allowedRoles.includes(role)) {
            router.replace(dashboardUrl)
        }
    }, [user, role, initialized, allowedRoles, dashboardUrl, router])

    if (loading || !initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f2f1]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
                    <p className="text-[#4A5565] text-sm">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!user) return null
    if (role && !allowedRoles.includes(role)) return null

    return <>{children}</>
}
