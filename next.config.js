/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'index, follow, max-image-preview:large, max-snippet:-1',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
