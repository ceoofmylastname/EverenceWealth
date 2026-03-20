'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Send, Mail, MailOpen, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
    id: string
    sender_type: string
    sender_id: string
    recipient_type: string
    recipient_id: string
    subject: string | null
    body: string
    read: boolean
    read_at: string | null
    created_at: string
}

export default function AgentMessagesPage() {
    const { user } = useAuth()
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'inbox' | 'sent' | 'compose'>('inbox')
    const [compose, setCompose] = useState({ client_id: '', subject: '', body: '' })
    const [sending, setSending] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

    useEffect(() => {
        if (!user) return
        loadMessages()
    }, [user])

    async function loadMessages() {
        try {
            const supabase = createClient()

            const { data: advisor } = await supabase
                .from('advisors')
                .select('id')
                .eq('user_id', user!.id)
                .single()

            if (!advisor) {
                setLoading(false)
                return
            }

            setAdvisorId(advisor.id)

            const [msgsRes, clientsRes] = await Promise.all([
                supabase.from('messages').select('*').or(`and(recipient_id.eq.${advisor.id},recipient_type.eq.advisor),and(sender_id.eq.${advisor.id},sender_type.eq.advisor)`).order('created_at', { ascending: false }),
                supabase.from('clients').select('id, first_name, last_name').eq('advisor_id', advisor.id).eq('status', 'active'),
            ])

            setMessages(msgsRes.data || [])
            setClients(clientsRes.data || [])
        } catch (err) {
            console.error('Messages load error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function sendMessage() {
        if (!advisorId || !compose.client_id || !compose.body.trim()) return
        setSending(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    sender_type: 'advisor',
                    sender_id: advisorId,
                    recipient_type: 'client',
                    recipient_id: compose.client_id,
                    subject: compose.subject.trim() || null,
                    body: compose.body.trim(),
                })
                .select()
                .single()

            if (error) throw error

            setMessages(prev => [data, ...prev])
            setCompose({ client_id: '', subject: '', body: '' })
            setTab('sent')
            toast.success('Message sent')
        } catch {
            toast.error('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    async function markAsRead(msgId: string) {
        const supabase = createClient()
        await supabase.from('messages').update({ read: true, read_at: new Date().toISOString() }).eq('id', msgId)
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true, read_at: new Date().toISOString() } : m))
    }

    const inboxMessages = messages.filter(m => m.recipient_type === 'advisor' && m.recipient_id === advisorId)
    const sentMessages = messages.filter(m => m.sender_type === 'advisor' && m.sender_id === advisorId)
    const unreadCount = inboxMessages.filter(m => !m.read).length

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId)
        return client ? `${client.first_name} ${client.last_name}` : 'Unknown'
    }

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
            </div>
        )
    }

    // Message detail view
    if (selectedMessage) {
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedMessage(null)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to messages
                </button>
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">{selectedMessage.subject || '(No subject)'}</h2>
                        <span className="text-xs text-gray-500">{formatDate(selectedMessage.created_at)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {selectedMessage.sender_type === 'advisor' ? 'You' : getClientName(selectedMessage.sender_id)}
                        {' → '}
                        {selectedMessage.recipient_type === 'advisor' ? 'You' : getClientName(selectedMessage.recipient_id)}
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap border-t border-white/10 pt-4">
                        {selectedMessage.body}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Messages</h1>
                    <p className="text-gray-400 mt-1">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
                </div>
                <button
                    onClick={() => setTab('compose')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors"
                >
                    <Send className="h-4 w-4" /> Compose
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setTab('inbox')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'inbox' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Inbox ({inboxMessages.length})
                </button>
                <button
                    onClick={() => setTab('sent')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'sent' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Sent ({sentMessages.length})
                </button>
                <button
                    onClick={() => setTab('compose')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        tab === 'compose' ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Compose
                </button>
            </div>

            {/* Compose */}
            {tab === 'compose' && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                    <select
                        value={compose.client_id}
                        onChange={(e) => setCompose(prev => ({ ...prev, client_id: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-gold"
                    >
                        <option value="">Select recipient</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={compose.subject}
                        onChange={(e) => setCompose(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Subject (optional)"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                    />
                    <textarea
                        value={compose.body}
                        onChange={(e) => setCompose(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Type your message..."
                        rows={6}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold resize-none"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sending || !compose.client_id || !compose.body.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-black text-sm font-medium rounded-lg hover:bg-brand-gold/80 transition-colors disabled:opacity-50"
                    >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            )}

            {/* Message List */}
            {(tab === 'inbox' || tab === 'sent') && (
                <div className="space-y-2">
                    {(tab === 'inbox' ? inboxMessages : sentMessages).length === 0 ? (
                        <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center">
                            <p className="text-gray-500">No {tab} messages</p>
                        </div>
                    ) : (
                        (tab === 'inbox' ? inboxMessages : sentMessages).map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => {
                                    setSelectedMessage(msg)
                                    if (tab === 'inbox' && !msg.read) markAsRead(msg.id)
                                }}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors text-left"
                            >
                                <div className="flex-shrink-0">
                                    {msg.read || tab === 'sent' ? (
                                        <MailOpen className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <Mail className="h-5 w-5 text-brand-gold" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm font-medium truncate ${!msg.read && tab === 'inbox' ? 'text-white' : 'text-gray-400'}`}>
                                            {tab === 'inbox'
                                                ? `From: ${getClientName(msg.sender_id)}`
                                                : `To: ${getClientName(msg.recipient_id)}`
                                            }
                                        </p>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(msg.created_at)}</span>
                                    </div>
                                    <p className={`text-sm truncate ${!msg.read && tab === 'inbox' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {msg.subject || msg.body.slice(0, 60)}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
