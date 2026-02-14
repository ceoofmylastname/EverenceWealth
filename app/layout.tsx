import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { organizationSchema, webSiteSchema, localBusinessSchema, JsonLd } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
    title: 'Everence Wealth | Bridge the Retirement Gap',
    description: 'Fiduciary wealth management helping you bridge the retirement gap with tax-efficient strategies and indexed life insurance.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
                <JsonLd data={organizationSchema()} />
                <JsonLd data={webSiteSchema()} />
                <JsonLd data={localBusinessSchema()} />
                {children}
                <Toaster />
            </body>
        </html>
    )
}
