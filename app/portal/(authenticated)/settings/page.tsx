'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { updatePassword } from '@/lib/auth'
import { Loader2, User, Shield, Bell, Save } from 'lucide-react'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'security' | 'notifications'

export default function SettingsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [clientId, setClientId] = useState<string | null>(null)
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    })
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (!user) return
        loadProfile()
    }, [user])

    async function loadProfile() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', user!.id)
                .single()

            if (client) {
                setClientId(client.id)
                setProfile({
                    first_name: client.first_name || '',
                    last_name: client.last_name || '',
                    email: client.email || '',
                    phone: client.phone || '',
                })
            }
        } catch (err) {
            console.error('Failed to load profile:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault()
        if (!clientId) return

        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('clients')
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone || null,
                })
                .eq('id', clientId)

            if (error) throw error
            toast.success('Profile updated')
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault()
        if (passwords.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setSaving(true)
        try {
            await updatePassword(passwords.newPassword)
            toast.success('Password updated')
            setPasswords({ newPassword: '', confirmPassword: '' })
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update password')
        } finally {
            setSaving(false)
        }
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1A4D3E]">Settings</h1>
                <p className="text-[#4A5565] text-sm mt-1">Manage your account preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#4A5565]/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'border-[#1A4D3E] text-[#1A4D3E]'
                                : 'border-transparent text-[#4A5565] hover:text-[#1A4D3E]'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="bg-white p-6 border border-[#4A5565]/10 shadow-sm space-y-6 max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4A5565] mb-1">First name</label>
                            <input
                                type="text"
                                value={profile.first_name}
                                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] focus:outline-none focus:border-[#1A4D3E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4A5565] mb-1">Last name</label>
                            <input
                                type="text"
                                value={profile.last_name}
                                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] focus:outline-none focus:border-[#1A4D3E]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A5565] mb-1">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-3 py-2 border border-[#4A5565]/10 text-[#4A5565] bg-[#f0f2f1] cursor-not-allowed"
                        />
                        <p className="text-xs text-[#4A5565] mt-1">Contact your advisor to change your email</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A5565] mb-1">Phone</label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                            className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save changes
                    </button>
                </form>
            )}

            {/* Security tab */}
            {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="bg-white p-6 border border-[#4A5565]/10 shadow-sm space-y-6 max-w-lg">
                    <h3 className="font-semibold text-[#1A4D3E]">Change Password</h3>
                    <div>
                        <label className="block text-sm font-medium text-[#4A5565] mb-1">New password</label>
                        <input
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="Minimum 8 characters"
                            minLength={8}
                            required
                            className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4A5565] mb-1">Confirm new password</label>
                        <input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="Confirm your new password"
                            required
                            className="w-full px-3 py-2 border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                        Update password
                    </button>
                </form>
            )}

            {/* Notifications tab */}
            {activeTab === 'notifications' && (
                <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm max-w-lg">
                    <h3 className="font-semibold text-[#1A4D3E] mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'New messages from advisor', description: 'Receive email when your advisor sends you a message' },
                            { label: 'Appointment reminders', description: 'Get reminded before scheduled appointments' },
                            { label: 'New documents', description: 'Notified when new documents are added to your vault' },
                            { label: 'Account updates', description: 'Updates about your policies and accounts' },
                        ].map((item) => (
                            <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="mt-1 h-4 w-4 accent-[#1A4D3E]"
                                />
                                <div>
                                    <p className="text-sm font-medium text-[#1A4D3E]">{item.label}</p>
                                    <p className="text-xs text-[#4A5565]">{item.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
