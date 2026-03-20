'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminCreateAdvisorPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        license_number: '',
        specialties: '',
        territories: '',
        bio: '',
    })
    const [creating, setCreating] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
            toast.error('First name, last name, and email are required')
            return
        }

        setCreating(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('advisors')
                .insert({
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    license_number: form.license_number.trim() || null,
                    specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
                    territories: form.territories.split(',').map(s => s.trim()).filter(Boolean),
                    bio: form.bio.trim() || null,
                    status: 'active',
                })

            if (error) throw error

            toast.success('Advisor created successfully')
            router.push('/admin/advisors')
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create advisor')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <Link href="/admin/advisors" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                <ArrowLeft className="h-4 w-4" /> Back to advisors
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-white">Add New Advisor</h1>
                <p className="text-gray-400 mt-1">Create a new advisor profile</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">First Name *</label>
                        <input
                            type="text"
                            value={form.first_name}
                            onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                            required
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Last Name *</label>
                        <input
                            type="text"
                            value={form.last_name}
                            onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                            required
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Email *</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">License Number</label>
                    <input
                        type="text"
                        value={form.license_number}
                        onChange={(e) => setForm(prev => ({ ...prev, license_number: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Specialties (comma-separated)</label>
                    <input
                        type="text"
                        value={form.specialties}
                        onChange={(e) => setForm(prev => ({ ...prev, specialties: e.target.value }))}
                        placeholder="IUL, Tax Planning, Retirement"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Territories (comma-separated)</label>
                    <input
                        type="text"
                        value={form.territories}
                        onChange={(e) => setForm(prev => ({ ...prev, territories: e.target.value }))}
                        placeholder="San Francisco, Bay Area, California"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Brief biography..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {creating ? 'Creating...' : 'Create Advisor'}
                </button>
            </form>
        </div>
    )
}
