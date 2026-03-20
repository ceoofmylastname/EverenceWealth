'use client'

import { useState } from 'react'
import { AuthProvider } from '@/app/providers/auth-provider'
import NavigationSidebar from '@/components/portal/navigation-sidebar'
import PortalHeader from '@/components/portal/portal-header'
import ProtectedRoute from '@/components/auth/protected-route'

export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <AuthProvider>
            <ProtectedRoute allowedRoles={['client', 'admin']}>
                <div className="min-h-screen bg-[#f0f2f1] flex">
                    <NavigationSidebar
                        mobileOpen={mobileMenuOpen}
                        onMobileClose={() => setMobileMenuOpen(false)}
                    />
                    <div className="flex-1 flex flex-col lg:ml-64">
                        <PortalHeader onMenuToggle={() => setMobileMenuOpen(true)} />
                        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    )
}
