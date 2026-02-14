import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import AdminErrorBoundary from '@/components/admin/ErrorBoundary'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-[#020806] min-h-screen text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <AdminErrorBoundary source="admin.layout">
                        {children}
                    </AdminErrorBoundary>
                </main>
            </div>
        </div>
    )
}
