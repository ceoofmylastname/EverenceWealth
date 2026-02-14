'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { detectRoleClient, getRoleDashboard, type UserRole } from '@/lib/auth'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    role: UserRole
    loading: boolean
    initialized: boolean
}

interface AuthContextType extends AuthState {
    refreshUser: () => Promise<void>
    dashboardUrl: string
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: null,
    loading: true,
    initialized: false,
    refreshUser: async () => {},
    dashboardUrl: '/login',
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        role: null,
        loading: true,
        initialized: false,
    })

    const supabase = createClient()

    const refreshUser = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            const role = await detectRoleClient(session.user.id)
            setState({
                user: session.user,
                session,
                role,
                loading: false,
                initialized: true,
            })
        } else {
            setState({
                user: null,
                session: null,
                role: null,
                loading: false,
                initialized: true,
            })
        }
    }, [supabase])

    useEffect(() => {
        refreshUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    setState({
                        user: null,
                        session: null,
                        role: null,
                        loading: false,
                        initialized: true,
                    })
                } else if (session?.user) {
                    const role = await detectRoleClient(session.user.id)
                    setState({
                        user: session.user,
                        session,
                        role,
                        loading: false,
                        initialized: true,
                    })
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase, refreshUser])

    const dashboardUrl = getRoleDashboard(state.role)

    return (
        <AuthContext.Provider value={{ ...state, refreshUser, dashboardUrl }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
