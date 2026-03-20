'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/providers/auth-provider'
import { Loader2, Send, MessageSquare, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
    id: string
    sender_type: string
    sender_id: string
    body: string
    read: boolean
    created_at: string
    subject: string | null
}

export default function MessagesPage() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [clientId, setClientId] = useState<string | null>(null)
    const [advisorId, setAdvisorId] = useState<string | null>(null)
    const [advisorName, setAdvisorName] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user) return
        loadMessages()
    }, [user])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (!clientId) return
        const supabase = createClient()

        const channel = supabase
            .channel('portal-messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `recipient_id=eq.${clientId}`,
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [clientId])

    async function loadMessages() {
        try {
            const supabase = createClient()
            const { data: client } = await supabase
                .from('clients')
                .select('id, advisor_id, advisors(first_name, last_name)')
                .eq('user_id', user!.id)
                .single()

            if (!client) { setLoading(false); return }

            setClientId(client.id)
            setAdvisorId(client.advisor_id)
            setAdvisorName(client.advisors ? `${(client.advisors as any).first_name} ${(client.advisors as any).last_name}` : 'Your Advisor')

            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${client.id},sender_type.eq.client),and(recipient_id.eq.${client.id},recipient_type.eq.client)`)
                .order('created_at', { ascending: true })

            setMessages(data || [])

            // Mark unread messages as read
            await supabase
                .from('messages')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('recipient_id', client.id)
                .eq('recipient_type', 'client')
                .eq('read', false)
        } catch (err) {
            console.error('Failed to load messages:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!newMessage.trim() || !clientId || !advisorId) return

        setSending(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('messages')
                .insert({
                    sender_type: 'client',
                    sender_id: clientId,
                    recipient_type: 'advisor',
                    recipient_id: advisorId,
                    body: newMessage.trim(),
                })

            if (error) throw error

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                sender_type: 'client',
                sender_id: clientId,
                body: newMessage.trim(),
                read: false,
                created_at: new Date().toISOString(),
                subject: null,
            }])
            setNewMessage('')
        } catch (err: any) {
            toast.error(err?.message || 'Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const formatTime = (d: string) => {
        const date = new Date(d)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A4D3E]" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#4A5565]/10">
                <div className="p-2 bg-[#1A4D3E]/10">
                    <User className="h-5 w-5 text-[#1A4D3E]" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-[#1A4D3E]">{advisorName}</h1>
                    <p className="text-xs text-[#4A5565]">Your financial advisor</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare className="h-12 w-12 text-[#4A5565]/20 mb-4" />
                        <p className="text-sm text-[#4A5565]">No messages yet</p>
                        <p className="text-xs text-[#4A5565]/60 mt-1">Send a message to start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isClient = msg.sender_type === 'client'
                        return (
                            <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${isClient ? 'order-2' : ''}`}>
                                    <div className={`px-4 py-3 ${
                                        isClient
                                            ? 'bg-[#1A4D3E] text-white'
                                            : 'bg-white border border-[#4A5565]/10 text-[#1A4D3E]'
                                    }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                                    </div>
                                    <p className={`text-xs mt-1 ${isClient ? 'text-right' : ''} text-[#4A5565]/60`}>
                                        {formatTime(msg.created_at)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="pt-4 border-t border-[#4A5565]/10">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="flex-1 px-4 py-3 border border-[#4A5565]/20 text-[#1A4D3E] placeholder-[#4A5565]/40 focus:outline-none focus:border-[#1A4D3E] transition-colors disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-[#1A4D3E] text-white hover:bg-[#1A4D3E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </form>
        </div>
    )
}
