import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    const token = process.env.REVALIDATION_SECRET

    // Validate secret if configured
    if (token && authHeader !== `Bearer ${token}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const paths: string[] = body.paths || []

        if (paths.length === 0) {
            // Default: revalidate homepage and blog listing
            revalidatePath('/')
            revalidatePath('/blog')
        } else {
            for (const path of paths) {
                revalidatePath(path)
            }
        }

        return NextResponse.json({
            revalidated: true,
            paths: paths.length > 0 ? paths : ['/', '/blog'],
            timestamp: Date.now()
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to revalidate' },
            { status: 500 }
        )
    }
}
