import { createClient } from '@/lib/supabase/server'
import type { UserRole, UserProfile } from '@/lib/auth'

export { getRoleDashboard } from '@/lib/auth'
export type { UserRole, UserProfile } from '@/lib/auth'

// ============================================================
// Server-side auth utilities (Server Components & Route Handlers only)
// ============================================================

export async function getCurrentUser(): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    const role = await detectRole(user.id)

    let profile = null
    if (role === 'admin') {
        const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single()
        if (data) profile = { id: data.id, first_name: data.name, last_name: '', ...data }
    } else if (role === 'advisor') {
        const { data } = await supabase
            .from('advisors')
            .select('*')
            .eq('user_id', user.id)
            .single()
        if (data) profile = data
    } else if (role === 'client') {
        const { data } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', user.id)
            .single()
        if (data) profile = data
    }

    return {
        id: user.id,
        email: user.email || '',
        role,
        profile,
    }
}

export async function detectRole(userId: string): Promise<UserRole> {
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
