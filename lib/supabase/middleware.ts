import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // ============================================================
    // Auth pages: redirect to dashboard if already logged in
    // ============================================================
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
    if (authPages.some(p => pathname === p)) {
        if (user) {
            const role = await detectRoleMiddleware(supabase, user.id)
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
        // Allow reset-password even without user (uses recovery token)
        return response
    }

    // ============================================================
    // Admin routes
    // ============================================================
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login' || pathname === '/admin/signup') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            return response
        }

        if (pathname === '/admin') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        }

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const role = await detectRoleMiddleware(supabase, user.id)
        if (role !== 'admin') {
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    // ============================================================
    // Advisor routes
    // ============================================================
    if (pathname.startsWith('/advisor')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const role = await detectRoleMiddleware(supabase, user.id)
        if (role !== 'advisor' && role !== 'admin') {
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    // ============================================================
    // Client portal routes
    // ============================================================
    if (pathname.startsWith('/portal')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const role = await detectRoleMiddleware(supabase, user.id)
        if (role !== 'client' && role !== 'admin') {
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    return response
}

// Lightweight role detection for middleware (no heavy imports)
type MiddlewareRole = 'admin' | 'advisor' | 'client' | null

async function detectRoleMiddleware(
    supabase: ReturnType<typeof createServerClient>,
    userId: string
): Promise<MiddlewareRole> {
    const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single()
    if (admin) return 'admin'

    const { data: advisor } = await supabase
        .from('advisors')
        .select('id')
        .eq('user_id', userId)
        .single()
    if (advisor) return 'advisor'

    const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', userId)
        .single()
    if (client) return 'client'

    return null
}

function getRoleDashboardPath(role: MiddlewareRole): string {
    switch (role) {
        case 'admin': return '/admin/dashboard'
        case 'advisor': return '/advisor/dashboard'
        case 'client': return '/portal/dashboard'
        default: return '/login'
    }
}
