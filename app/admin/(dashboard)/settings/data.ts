
import { createClient } from '@/lib/supabase/server'
import { decrypt } from './utils'

const SECURE_KEYS = ['fal_api_key', 'perplexity_api_key', 'openai_api_key', 'gemini_api_key']

export async function getSettings() {
    const supabase = createClient()
    const { data, error } = await supabase.from('settings').select('*')

    if (error) throw new Error(error.message)

    // Decrypt sensitive keys
    const settings = data.map(setting => {
        if (SECURE_KEYS.includes(setting.setting_key)) {
            return { ...setting, setting_value: decrypt(setting.setting_value) }
        }
        return setting
    })

    return settings
}
