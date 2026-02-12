import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // supabase client for middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login and signup pages from redirect loop
        if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/signup') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return response;
        }

        // Redirect /admin to /admin/dashboard if authenticated
        if (request.nextUrl.pathname === '/admin') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            // Let the next block handle unauthed redirect
        }

        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return response;
}
