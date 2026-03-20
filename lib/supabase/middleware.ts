import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
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
            // If user has no role, let them stay on the auth page (avoid redirect loop)
            if (!role) return response
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
            if (!role) return NextResponse.redirect(new URL('/', request.url))
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    // ============================================================
    // Agent/Advisor routes
    // ============================================================
    if (pathname.startsWith('/agent')) {
        if (pathname === '/agent/login') {
            if (user) {
                return NextResponse.redirect(new URL('/agent/dashboard', request.url))
            }
            return response
        }

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const role = await detectRoleMiddleware(supabase, user.id)
        if (role !== 'advisor' && role !== 'admin') {
            if (!role) return NextResponse.redirect(new URL('/', request.url))
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    // ============================================================
    // Client portal routes
    // ============================================================
    if (pathname.startsWith('/portal')) {
        // Allow portal login and signup pages without auth
        if (pathname === '/portal/login' || pathname === '/portal/signup') {
            if (user) {
                const role = await detectRoleMiddleware(supabase, user.id)
                if (role === 'client' || role === 'admin') {
                    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
                }
                // If user has no portal role (or no role at all), let them stay on login
                if (!role) return response
                const dashboard = getRoleDashboardPath(role)
                return NextResponse.redirect(new URL(dashboard, request.url))
            }
            return response
        }

        if (!user) {
            return NextResponse.redirect(new URL('/portal/login', request.url))
        }

        const role = await detectRoleMiddleware(supabase, user.id)
        if (role !== 'client' && role !== 'admin') {
            if (!role) return NextResponse.redirect(new URL('/', request.url))
            const dashboard = getRoleDashboardPath(role)
            return NextResponse.redirect(new URL(dashboard, request.url))
        }
    }

    return response
}

// Lightweight role detection for middleware using service role (bypasses RLS)
type MiddlewareRole = 'admin' | 'advisor' | 'client' | null

async function detectRoleMiddleware(
    _supabase: ReturnType<typeof createServerClient>,
    userId: string
): Promise<MiddlewareRole> {
    const serviceClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: admin } = await serviceClient
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single()
    if (admin) return 'admin'

    const { data: advisor } = await serviceClient
        .from('advisors')
        .select('id')
        .eq('user_id', userId)
        .single()
    if (advisor) return 'advisor'

    const { data: client } = await serviceClient
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
        case 'advisor': return '/agent/dashboard'
        case 'client': return '/portal/dashboard'
        default: return '/'
    }
}
