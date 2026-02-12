import { getSettings } from './data'
import SettingsForm from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const settingsData = await getSettings()

    const initialData = {
        master_prompt: settingsData.find(s => s.setting_key === 'master_prompt')?.setting_value || '',
        fal_api_key: settingsData.find(s => s.setting_key === 'fal_api_key')?.setting_value || '',
        perplexity_api_key: settingsData.find(s => s.setting_key === 'perplexity_api_key')?.setting_value || '',
        openai_api_key: settingsData.find(s => s.setting_key === 'openai_api_key')?.setting_value || '',
        site_base_url: settingsData.find(s => s.setting_key === 'site_base_url')?.setting_value || '',
        default_author: settingsData.find(s => s.setting_key === 'default_author')?.setting_value || '',
    }

    return (
        <div>
            <div>
                <h2 className="text-3xl font-bold text-brand-gold">Settings</h2>
                <p className="mt-1 text-sm text-gray-400">Manage your application configuration and API keys.</p>
            </div>
            <div className="mt-8">
                <SettingsForm initialData={initialData} />
            </div>
        </div>
    )
}
