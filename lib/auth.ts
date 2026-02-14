import { createClient } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'advisor' | 'client' | null

export interface UserProfile {
    id: string
    email: string
    role: UserRole
    profile: {
        id: string
        first_name: string
        last_name: string
        [key: string]: any
    } | null
}

export function getRoleDashboard(role: UserRole): string {
    switch (role) {
        case 'admin': return '/admin/dashboard'
        case 'advisor': return '/advisor/dashboard'
        case 'client': return '/portal/dashboard'
        default: return '/login'
    }
}

// ============================================================
// Client-side auth utilities
// ============================================================

export async function signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) throw error
    return data
}

export async function signUp(
    email: string,
    password: string,
    metadata: { first_name: string; last_name: string; phone?: string }
) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
            emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
    })
    if (error) throw error
    return data
}

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
}

export async function updatePassword(newPassword: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })
    if (error) throw error
}

export async function detectRoleClient(userId: string): Promise<UserRole> {
    const supabase = createClient()

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
