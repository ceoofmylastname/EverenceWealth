import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { decrypt } from '@/app/admin/(dashboard)/settings/utils'

async function getGeminiApiKey(supabase: any): Promise<string | null> {
    if (process.env.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY
    }

    const { data } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_key', 'gemini_api_key')
        .single()

    if (data?.setting_value) {
        return decrypt(data.setting_value)
    }

    return null
}

export async function POST(request: NextRequest) {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { errorId } = await request.json()
    if (!errorId) {
        return NextResponse.json({ error: 'errorId is required' }, { status: 400 })
    }

    const { data: errorRecord, error: fetchError } = await supabase
        .from('system_errors')
        .select('*')
        .eq('id', errorId)
        .single()

    if (fetchError || !errorRecord) {
        return NextResponse.json({ error: 'Error not found' }, { status: 404 })
    }

    const apiKey = await getGeminiApiKey(supabase)
    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API key not configured. Add it in Settings or set GEMINI_API_KEY env var.' }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const prompt = `You are a PostgreSQL and Supabase expert debugging errors in a Next.js admin dashboard.

DATABASE CONTEXT:
The application uses Supabase (PostgreSQL) with these known tables: admin_users, settings, clusters, blog_posts, system_errors, schema_fixes.

ERROR DETAILS:
- Error Code: ${errorRecord.error_code || 'N/A'}
- Error Message: ${errorRecord.error_message}
- Source: ${errorRecord.source || 'Unknown'}
- Additional Details: ${JSON.stringify(errorRecord.error_details, null, 2)}

TASK:
1. Explain what this error means in plain English (2-3 sentences max).
2. Identify the root cause.
3. If this is a schema error (missing column, wrong type, constraint violation, missing table, etc.), provide an exact SQL fix.
4. If this is NOT a schema error (e.g., auth error, network error, API error), say "No SQL fix needed" and explain the proper resolution.

RESPOND IN THIS EXACT JSON FORMAT (no markdown fences):
{
  "explanation": "Plain English explanation of the error",
  "rootCause": "Technical root cause",
  "hasSqlFix": true,
  "sqlFix": "ALTER TABLE ... ADD COLUMN ...;",
  "fixDescription": "What this SQL does",
  "alternativeResolution": null,
  "riskLevel": "low"
}

OR if no SQL fix is needed:
{
  "explanation": "Plain English explanation",
  "rootCause": "Technical root cause",
  "hasSqlFix": false,
  "sqlFix": null,
  "fixDescription": null,
  "alternativeResolution": "Steps to resolve without SQL",
  "riskLevel": "low"
}`

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        })
        const responseText = result.text || ''

        const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const analysis = JSON.parse(jsonStr)

        await supabase
            .from('system_errors')
            .update({
                ai_analysis: analysis.explanation + '\n\nRoot Cause: ' + analysis.rootCause +
                    (analysis.alternativeResolution ? '\n\nResolution: ' + analysis.alternativeResolution : ''),
                suggested_sql: analysis.hasSqlFix ? analysis.sqlFix : null,
                status: 'analyzed',
            })
            .eq('id', errorId)

        if (analysis.hasSqlFix && analysis.sqlFix) {
            await supabase.from('schema_fixes').insert({
                error_id: errorId,
                sql_command: analysis.sqlFix,
                description: analysis.fixDescription,
                status: 'pending',
            })
        }

        return NextResponse.json({ success: true, analysis })
    } catch (aiError: any) {
        console.error('Gemini analysis error:', aiError)
        return NextResponse.json({ error: 'AI analysis failed: ' + (aiError.message || String(aiError)) }, { status: 500 })
    }
}
