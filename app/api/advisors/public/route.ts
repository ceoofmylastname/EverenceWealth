import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/advisors/public — public list of active advisors (no auth required)
export async function GET() {
    try {
        const serviceClient = createServiceClient()

        const { data: advisors, error } = await serviceClient
            .from('advisors')
            .select('id, first_name, last_name, email, phone, bio, specialties, territories, photo_url, calendar_url')
            .eq('status', 'active')
            .order('first_name', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ advisors: advisors || [] })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
    }
}
