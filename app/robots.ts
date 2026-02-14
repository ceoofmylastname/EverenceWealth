import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
