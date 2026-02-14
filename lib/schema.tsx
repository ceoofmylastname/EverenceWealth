const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const COMPANY = {
    name: 'Everence Wealth',
    legalName: 'Everence Wealth',
    description: 'Independent fiduciary wealth management firm helping clients bridge the retirement gap with tax-efficient strategies and indexed life insurance.',
    url: SITE_URL,
    email: 'info@everencewealth.com',
    phone: '(555) 123-4567',
    address: {
        street: '455 Market St, Suite 1940',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US',
    },
    social: {
        linkedin: 'https://www.linkedin.com/company/everencewealth',
        twitter: 'https://twitter.com/everencewealth',
        instagram: 'https://www.instagram.com/everencewealth',
    },
} as const

export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: COMPANY.url,
        description: COMPANY.description,
        email: COMPANY.email,
        telephone: COMPANY.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY.address.street,
            addressLocality: COMPANY.address.city,
            addressRegion: COMPANY.address.state,
            postalCode: COMPANY.address.zip,
            addressCountry: COMPANY.address.country,
        },
        sameAs: [
            COMPANY.social.linkedin,
            COMPANY.social.twitter,
            COMPANY.social.instagram,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: COMPANY.phone,
            contactType: 'customer service',
            email: COMPANY.email,
            availableLanguage: ['English', 'Spanish'],
        },
    }
}

export function webSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: COMPANY.name,
        url: SITE_URL,
        description: COMPANY.description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}

export function localBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FinancialService',
        '@id': `${SITE_URL}/#business`,
        name: COMPANY.name,
        url: SITE_URL,
        description: COMPANY.description,
        telephone: COMPANY.phone,
        email: COMPANY.email,
        priceRange: '$$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY.address.street,
            addressLocality: COMPANY.address.city,
            addressRegion: COMPANY.address.state,
            postalCode: COMPANY.address.zip,
            addressCountry: COMPANY.address.country,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.7909,
            longitude: -122.3987,
        },
        areaServed: {
            '@type': 'Country',
            name: 'United States',
        },
        serviceType: [
            'Wealth Management',
            'Retirement Planning',
            'Tax Strategy',
            'Indexed Life Insurance',
            'Fiduciary Financial Planning',
        ],
        sameAs: [
            COMPANY.social.linkedin,
            COMPANY.social.twitter,
            COMPANY.social.instagram,
        ],
    }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

export function faqSchema(items: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }
}

export function webPageSchema(opts: {
    name: string
    description: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': opts.url,
        name: opts.name,
        description: opts.description,
        url: opts.url,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.speakable-answer', 'article h2'],
        },
    }
}

export function blogPostingSchema(opts: {
    title: string
    description: string | null
    slug: string
    datePublished: string
    dateModified: string
    wordCount?: number | null
    readingTime?: number | null
    keywords?: string | null
    language?: string
    imageUrl?: string
}) {
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: opts.title,
        description: opts.description,
        datePublished: opts.datePublished,
        dateModified: opts.dateModified,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${opts.slug}`,
        },
        inLanguage: opts.language || 'en',
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.speakable-answer'],
        },
    }

    if (opts.wordCount) schema.wordCount = opts.wordCount
    if (opts.readingTime) schema.timeRequired = `PT${opts.readingTime}M`
    if (opts.imageUrl) schema.image = opts.imageUrl
    if (opts.keywords) schema.keywords = opts.keywords

    return schema
}

export function collectionPageSchema(opts: {
    name: string
    description: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': opts.url,
        name: opts.name,
        description: opts.description,
        url: opts.url,
        isPartOf: { '@id': `${SITE_URL}/#website` },
    }
}

export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}
