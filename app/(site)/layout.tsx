'use client'

import { AssessmentModalProvider } from '@/components/AssessmentModal'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <AssessmentModalProvider>
            {children}
        </AssessmentModalProvider>
    )
}
