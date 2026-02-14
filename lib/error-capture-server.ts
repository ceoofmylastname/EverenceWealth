import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type SystemErrorInsert = Database['public']['Tables']['system_errors']['Insert']

interface CaptureErrorOptions {
    errorCode?: string
    source: string
    severity?: 'warning' | 'error' | 'critical'
    details?: Record<string, any>
}

export async function captureErrorServer(
    error: any,
    options: CaptureErrorOptions
): Promise<void> {
    try {
        const supabase = createClient()

        const errorRecord: SystemErrorInsert = {
            error_code: options.errorCode || error?.code || null,
            error_message: typeof error === 'string' ? error : (error?.message || String(error)),
            error_details: {
                ...options.details,
                hint: error?.hint || null,
                stack: error?.stack || null,
            },
            source: options.source,
            severity: options.severity || 'error',
            status: 'new',
        }

        await supabase.from('system_errors').insert(errorRecord)
    } catch (captureErr) {
        console.error('[error-capture-server] Failed to capture error:', captureErr)
    }
}
