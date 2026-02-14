'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { saveSettings } from './actions'

type SettingsFormValues = {
    master_prompt: string
    fal_api_key: string
    perplexity_api_key: string
    openai_api_key: string
    gemini_api_key: string
    site_base_url: string
    default_author: string
}

export default function SettingsForm({ initialData }: { initialData: SettingsFormValues }) {
    const [saving, setSaving] = useState(false)
    const [promptStatus, setPromptStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const [showKeys, setShowKeys] = useState({
        fal: false,
        perplexity: false,
        openai: false,
        gemini: false
    })

    const { register, handleSubmit, control, formState: { errors } } = useForm<SettingsFormValues>({
        defaultValues: initialData
    })

    // Watch master_prompt for auto-save
    const masterPromptValue = useWatch({
        control,
        name: 'master_prompt'
    })

    const lastSavedPrompt = useRef(initialData.master_prompt)

    // Debounced Auto-Save for Master Prompt
    useEffect(() => {
        if (masterPromptValue === lastSavedPrompt.current) return

        setPromptStatus('saving')
        const timer = setTimeout(async () => {
            const formData = new FormData()
            formData.append('master_prompt', masterPromptValue)

            // Generate a silent save
            try {
                await saveSettings(formData)
                lastSavedPrompt.current = masterPromptValue
                setPromptStatus('saved')
            } catch (error) {
                setPromptStatus('unsaved')
                console.error("Auto-save failed", error)
            }
        }, 1500) // 1.5s debounce

        return () => clearTimeout(timer)
    }, [masterPromptValue])


    const onSubmit = async (data: SettingsFormValues) => {
        setSaving(true)
        const formData = new FormData()

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            const result = await saveSettings(formData)
            if (result.error) {
                toast.error('Failed to save settings: ' + result.error)
            } else {
                toast.success('Settings saved successfully')
                lastSavedPrompt.current = data.master_prompt
                setPromptStatus('saved')
            }
        } catch (error) {
            toast.error('Unexpected error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const toggleKeyVisibility = (key: keyof typeof showKeys) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Header Actions - Fixed Visibility */}
                <div className="flex justify-between items-center sticky top-0 z-20 bg-[#020806]/95 backdrop-blur-md py-4 border-b border-white/10 mb-8 px-4 rounded-xl border border-white/5 shadow-2xl">
                    <span className="text-gray-400 text-sm">
                        {promptStatus === 'saving' && <span className="flex items-center text-brand-gold"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Auto-saving prompt...</span>}
                        {promptStatus === 'saved' && <span className="flex items-center text-green-500"><CheckCircle className="w-4 h-4 mr-2" /> All changes saved</span>}
                        {promptStatus === 'unsaved' && <span className="flex items-center text-red-400"><AlertCircle className="w-4 h-4 mr-2" /> Unsaved changes</span>}
                    </span>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold focus:ring-offset-[#020806] disabled:opacity-50 transition-all"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Master Prompt Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900">Master Prompt</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                This prompt serves as the foundation for all AI content generation.
                            </p>
                        </div>
                        {/* Prompt Status Indicator */}
                        <div className="text-sm">
                            {promptStatus === 'saving' && <span className="text-orange-500 font-medium animate-pulse">Saving...</span>}
                            {promptStatus === 'saved' && <span className="text-green-600 font-medium">Saved</span>}
                        </div>
                    </div>
                    <div className="p-6">
                        <textarea
                            {...register('master_prompt')}
                            rows={15}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold sm:text-sm font-mono text-gray-900 bg-white placeholder-gray-400"
                            placeholder="You are a fiduciary wealth strategist writing for..."
                        />
                    </div>
                </div>

                {/* API Keys Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                        <h3 className="text-lg leading-6 font-bold text-gray-900">API Keys</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Securely manage access credentials for external AI services.
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                            {/* Fal.ai */}
                            <div>
                                <label htmlFor="fal_api_key" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Fal.ai API Key
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type={showKeys.fal ? 'text' : 'password'}
                                        {...register('fal_api_key')}
                                        id="fal_api_key"
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-brand-gold focus:ring-brand-gold sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="key_..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('fal')}
                                        className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-colors"
                                    >
                                        {showKeys.fal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Perplexity */}
                            <div>
                                <label htmlFor="perplexity_api_key" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Perplexity API Key
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type={showKeys.perplexity ? 'text' : 'password'}
                                        {...register('perplexity_api_key')}
                                        id="perplexity_api_key"
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-brand-gold focus:ring-brand-gold sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="pplx-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('perplexity')}
                                        className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-colors"
                                    >
                                        {showKeys.perplexity ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* OpenAI */}
                            <div>
                                <label htmlFor="openai_api_key" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    OpenAI API Key
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type={showKeys.openai ? 'text' : 'password'}
                                        {...register('openai_api_key')}
                                        id="openai_api_key"
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-brand-gold focus:ring-brand-gold sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="sk-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('openai')}
                                        className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-colors"
                                    >
                                        {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Google Gemini */}
                            <div>
                                <label htmlFor="gemini_api_key" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Google Gemini API Key
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type={showKeys.gemini ? 'text' : 'password'}
                                        {...register('gemini_api_key')}
                                        id="gemini_api_key"
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-brand-gold focus:ring-brand-gold sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="AIza..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleKeyVisibility('gemini')}
                                        className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-colors"
                                    >
                                        {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Used for AI-powered error analysis in System Errors.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Site Configuration Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                        <h3 className="text-lg leading-6 font-bold text-gray-900">Site Configuration</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            General settings for your Everence Wealth site.
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="site_base_url" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Base URL
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        {...register('site_base_url')}
                                        id="site_base_url"
                                        className="shadow-sm focus:ring-brand-gold focus:border-brand-gold block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
                                        placeholder="https://www.everencewealth.com"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Used for canonical URLs and SEO.</p>
                            </div>

                            <div>
                                <label htmlFor="default_author" className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Default Author
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        {...register('default_author')}
                                        id="default_author"
                                        className="shadow-sm focus:ring-brand-gold focus:border-brand-gold block w-full sm:text-sm border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
                                        placeholder="Everence Wealth Team"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-end pt-4 mb-16">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md shadow-lg text-[#020806] bg-brand-gold hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold focus:ring-offset-[#020806] disabled:opacity-50 transition-all transform hover:-translate-y-1"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin h-6 w-6 mr-2" />
                        ) : (
                            <Save className="h-6 w-6 mr-2" />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
