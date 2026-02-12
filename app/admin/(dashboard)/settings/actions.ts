'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { encrypt } from './utils'

const SECURE_KEYS = ['fal_api_key', 'perplexity_api_key', 'openai_api_key']

export async function saveSettings(formData: FormData) {
    const supabase = createClient()
    const updates = []

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error('Save Settings Error: Not authenticated', authError)
        return { error: 'Not authenticated. Please log in again.' }
    }

    // Extract and encrypt
    for (const [key, value] of Array.from(formData.entries())) {
        if (typeof value === 'string') {
            let finalValue = value
            if (SECURE_KEYS.includes(key)) {
                // Only encrypt if it's not already encrypted (doesn't contain ':')
                // OR if the value has changed (which we can't easily track here without diff)
                // For now, simple re-encrypt is safer, but might double-encrypt if we're not careful.
                // Actually, the form sends raw text (if user typed) or the *original* encrypted text (if user didn't tough it).
                // Wait, the client sends 'key_...' or masked value?
                // The input type is 'password'. The value is the decrypted value from getSettings if we sent it down.
                // But getSettings sends decrypted values. So the form has plain text. perfect.
                finalValue = encrypt(value)
            }

            let settingType = 'text'
            if (key.includes('api_key')) settingType = 'api_key'
            if (key === 'master_prompt') settingType = 'prompt'

            updates.push({
                setting_key: key,
                setting_value: finalValue,
                setting_type: settingType,
                updated_at: new Date().toISOString(),
                // updated_by: user.id // Commenting out to avoid potential public->auth schema permission issues
            })
        }
    }

    const { error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'setting_key' })

    if (error) {
        console.error('Save Settings Supabase Error:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/settings')
    return { success: true }
}
