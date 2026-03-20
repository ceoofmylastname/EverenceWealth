'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, FileText, Upload, Download, X, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const documentTypeLabels: Record<string, string> = {
    policy: 'Policy',
    statement: 'Statement',
    tax_form: 'Tax Form',
    financial_plan: 'Financial Plan',
    other: 'Other',
}

export default function DocumentsPage() {
    const { user } = useAuth()
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [filterType, setFilterType] = useState('')
    const [filterYear, setFilterYear] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [clientId, setClientId] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        loadDocuments()
    }, [user])

    async function loadDocuments() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }
            setClientId(client.id)

            const { data } = await supabase
                .from('document_vault')
                .select('*')
                .eq('client_id', client.id)
                .order('created_at', { ascending: false })

            setDocuments(data || [])
        } catch (err) {
            console.error('Failed to load documents:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !clientId) return

        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            toast.error('File must be under 10MB')
            return
        }

        setUploading(true)
        try {
            const supabase = createClient()
            const filePath = `${clientId}/${Date.now()}-${file.name}`

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath)

            const { error: insertError } = await supabase
                .from('document_vault')
                .insert({
                    client_id: clientId,
                    uploaded_by_type: 'client',
                    uploaded_by_id: user!.id,
                    document_type: 'other',
                    file_name: file.name,
                    file_url: publicUrl,
                    file_size: file.size,
                    year: new Date().getFullYear(),
                })

            if (insertError) throw insertError

            toast.success('Document uploaded successfully')
            setShowUpload(false)
            loadDocuments()
        } catch (err: any) {
            toast.error(err?.message || 'Upload failed')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const years = Array.from(new Set(documents.map(d => d.year).filter(Boolean))).sort((a, b) => b - a)

    const filtered = documents.filter(doc => {
        if (filterType && doc.document_type !== filterType) return false
        if (filterYear && doc.year !== parseInt(filterYear)) return false
        return true
    })

    const formatFileSize = (bytes: number) => {
        if (!bytes) return ''
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A4D3E]">Documents</h1>
                    <p className="text-[#4A5565] text-sm mt-1">Your secure document vault</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                >
                    <Upload className="h-4 w-4" />
                    Upload
                </button>
            </div>

            {/* Upload modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[#1A4D3E]">Upload Document</h3>
                            <button onClick={() => setShowUpload(false)} className="text-[#4A5565] hover:text-[#1A4D3E]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div
                            className="border-2 border-dashed border-[#4A5565]/20 p-8 text-center cursor-pointer hover:border-[#1A4D3E]/40 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E] mx-auto" />
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-[#4A5565]/40 mx-auto mb-2" />
                                    <p className="text-sm text-[#4A5565]">Click to select a file</p>
                                    <p className="text-xs text-[#4A5565]/60 mt-1">PDF, DOC, JPG, PNG (max 10MB)</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleUpload}
                        />
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-[#4A5565]" />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm border border-[#4A5565]/20 px-3 py-2 text-[#1A4D3E] bg-white focus:outline-none focus:border-[#1A4D3E]"
                >
                    <option value="">All types</option>
                    {Object.entries(documentTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
                <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="text-sm border border-[#4A5565]/20 px-3 py-2 text-[#1A4D3E] bg-white focus:outline-none focus:border-[#1A4D3E]"
                >
                    <option value="">All years</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Documents table */}
            {filtered.length === 0 ? (
                <div className="bg-white p-12 border border-[#4A5565]/10 shadow-sm text-center">
                    <FileText className="h-12 w-12 text-[#4A5565]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1A4D3E]">No documents</h3>
                    <p className="text-sm text-[#4A5565] mt-1">
                        Documents from your advisor will appear here.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-[#4A5565]/10 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#4A5565]/10 bg-[#f0f2f1]">
                                <th className="text-left text-xs font-semibold text-[#4A5565] uppercase tracking-wider px-6 py-3">Document</th>
                                <th className="text-left text-xs font-semibold text-[#4A5565] uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Type</th>
                                <th className="text-left text-xs font-semibold text-[#4A5565] uppercase tracking-wider px-6 py-3 hidden md:table-cell">Year</th>
                                <th className="text-left text-xs font-semibold text-[#4A5565] uppercase tracking-wider px-6 py-3 hidden md:table-cell">Size</th>
                                <th className="text-right text-xs font-semibold text-[#4A5565] uppercase tracking-wider px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4A5565]/10">
                            {filtered.map((doc) => (
                                <tr key={doc.id} className="hover:bg-[#f0f2f1]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-4 w-4 text-[#4A5565] flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-[#1A4D3E]">{doc.file_name}</p>
                                                {doc.description && (
                                                    <p className="text-xs text-[#4A5565]">{doc.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="text-xs font-medium text-[#4A5565] bg-[#f0f2f1] px-2 py-1">
                                            {documentTypeLabels[doc.document_type] || doc.document_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#4A5565] hidden md:table-cell">
                                        {doc.year || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#4A5565] hidden md:table-cell">
                                        {formatFileSize(doc.file_size)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-[#1A4D3E] hover:text-[#1A4D3E]/80 font-medium"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="hidden sm:inline">Download</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
