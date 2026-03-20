'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { updatePassword } from '@/lib/auth'
import { Loader2, Save, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdvisorProfile {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    bio: string | null
    photo_url: string | null
    license_number: string | null
    specialties: string[] | null
    territories: string[] | null
    calendar_url: string | null
}

export default function AgentSettingsPage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<AdvisorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
    const [changingPassword, setChangingPassword] = useState(false)
    const [specialtiesInput, setSpecialtiesInput] = useState('')
    const [territoriesInput, setTerritoriesInput] = useState('')

    useEffect(() => {
        if (!user) return
        loadProfile()
    }, [user])

    async function loadProfile() {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('advisors')
                .select('id, first_name, last_name, email, phone, bio, photo_url, license_number, specialties, territories, calendar_url')
                .eq('user_id', user!.id)
                .single()

            if (data) {
                setProfile(data)
                setSpecialtiesInput((data.specialties || []).join(', '))
                setTerritoriesInput((data.territories || []).join(', '))
            }
        } catch (err) {
            console.error('Profile load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function saveProfile() {
        if (!profile) return
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('advisors')
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone,
                    bio: profile.bio,
                    photo_url: profile.photo_url,
                    calendar_url: profile.calendar_url,
                    specialties: specialtiesInput.split(',').map(s => s.trim()).filter(Boolean),
                    territories: territoriesInput.split(',').map(s => s.trim()).filter(Boolean),
                })
                .eq('id', profile.id)

            if (error) throw error
            toast.success('Profile updated')
        } catch {
            toast.error('Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    async function handlePasswordChange() {
        if (!passwordForm.new || passwordForm.new !== passwordForm.confirm) {
            toast.error('Passwords do not match')
            return
        }
        if (passwordForm.new.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        setChangingPassword(true)
        try {
            await updatePassword(passwordForm.new)
            toast.success('Password updated')
            setPasswordForm({ current: '', new: '', confirm: '' })
        } catch (err: any) {
            toast.error(err?.message || 'Failed to change password')
        } finally {
            setChangingPassword(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    if (!profile) {
        return <p className="text-gray-400 text-center py-12">Advisor profile not found</p>
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-sm font-semibold text-white">Profile Information</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">First Name</label>
                        <input
                            type="text"
                            value={profile.first_name}
                            onChange={(e) => setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={profile.last_name}
                            onChange={(e) => setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Bio</label>
                    <textarea
                        value={profile.bio || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                        placeholder="Tell clients about yourself..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Calendar URL</label>
                    <input
                        type="url"
                        value={profile.calendar_url || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, calendar_url: e.target.value } : null)}
                        placeholder="https://calendly.com/your-link"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Photo URL</label>
                    <input
                        type="url"
                        value={profile.photo_url || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, photo_url: e.target.value } : null)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Specialties (comma-separated)</label>
                    <input
                        type="text"
                        value={specialtiesInput}
                        onChange={(e) => setSpecialtiesInput(e.target.value)}
                        placeholder="IUL, Tax Planning, Retirement"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Territories (comma-separated)</label>
                    <input
                        type="text"
                        value={territoriesInput}
                        onChange={(e) => setTerritoriesInput(e.target.value)}
                        placeholder="San Francisco, Bay Area, California"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                {profile.license_number && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">License Number</label>
                        <p className="text-sm text-gray-400">{profile.license_number}</p>
                    </div>
                )}

                <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Password Section */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Change Password
                </h3>

                <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="New password (min 8 characters)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                />
                <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                />
                <button
                    onClick={handlePasswordChange}
                    disabled={changingPassword}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                    {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </div>
    )
}
