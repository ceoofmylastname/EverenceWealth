'use client'

import { useState } from 'react'
import { AuthProvider } from '@/app/providers/auth-provider'
import AgentSidebar from '@/components/agent/agent-sidebar'
import AgentHeader from '@/components/agent/agent-header'
import ProtectedRoute from '@/components/auth/protected-route'

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <AuthProvider>
            <ProtectedRoute allowedRoles={['advisor', 'admin']}>
                <div className="flex bg-[#020806] min-h-screen text-white">
                    <AgentSidebar
                        mobileOpen={mobileMenuOpen}
                        onMobileClose={() => setMobileMenuOpen(false)}
                    />
                    <div className="flex-1 flex flex-col lg:ml-64">
                        <AgentHeader
                            onMenuToggle={() => setMobileMenuOpen(true)}
                        />
                        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    )
}
