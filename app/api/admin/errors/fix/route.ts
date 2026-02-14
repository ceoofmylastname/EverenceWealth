import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fixId } = await request.json()
    if (!fixId) {
        return NextResponse.json({ error: 'fixId is required' }, { status: 400 })
    }

    const { data: fix, error: fetchError } = await supabase
        .from('schema_fixes')
        .select('*')
        .eq('id', fixId)
        .single()

    if (fetchError || !fix) {
        return NextResponse.json({ error: 'Fix not found' }, { status: 404 })
    }

    if (fix.status === 'applied') {
        return NextResponse.json({ error: 'Fix has already been applied' }, { status: 400 })
    }

    const { data: result, error: rpcError } = await supabase.rpc('exec_admin_sql', {
        sql_command: fix.sql_command,
    })

    if (rpcError) {
        await supabase
            .from('schema_fixes')
            .update({
                status: 'failed',
                result_message: rpcError.message,
            })
            .eq('id', fixId)

        return NextResponse.json({ error: 'SQL execution failed: ' + rpcError.message }, { status: 500 })
    }

    const rpcResult = result as { success: boolean; message?: string; error?: string }

    if (rpcResult.success) {
        await supabase
            .from('schema_fixes')
            .update({
                status: 'applied',
                applied_at: new Date().toISOString(),
                applied_by: user.id,
                result_message: rpcResult.message || 'Success',
            })
            .eq('id', fixId)

        if (fix.error_id) {
            await supabase
                .from('system_errors')
                .update({
                    status: 'fixed',
                    resolved_at: new Date().toISOString(),
                    resolved_by: user.id,
                })
                .eq('id', fix.error_id)
        }

        return NextResponse.json({ success: true, message: rpcResult.message })
    } else {
        await supabase
            .from('schema_fixes')
            .update({
                status: 'failed',
                result_message: rpcResult.error || 'Unknown error',
            })
            .eq('id', fixId)

        return NextResponse.json({ error: 'SQL execution error: ' + (rpcResult.error || 'Unknown') }, { status: 500 })
    }
}
