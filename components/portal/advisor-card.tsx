import { Mail, Phone, Calendar, MessageSquare, User } from 'lucide-react'
import Link from 'next/link'

interface AdvisorCardProps {
    advisor: {
        first_name: string
        last_name: string
        email: string
        phone: string | null
        photo_url: string | null
        bio: string | null
        specialties: string[] | null
        calendar_url: string | null
    } | null
    compact?: boolean
}

export default function AdvisorCard({ advisor, compact = false }: AdvisorCardProps) {
    if (!advisor) {
        return (
            <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
                <p className="text-sm text-[#4A5565]">No advisor assigned yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
            <h3 className="text-xs font-semibold text-[#4A5565] uppercase tracking-wider mb-4">Your Advisor</h3>
            <div className="flex items-start gap-4">
                {advisor.photo_url ? (
                    <img
                        src={advisor.photo_url}
                        alt={`${advisor.first_name} ${advisor.last_name}`}
                        className="w-14 h-14 object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-14 h-14 bg-[#1A4D3E]/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-[#1A4D3E]" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A4D3E]">
                        {advisor.first_name} {advisor.last_name}
                    </p>
                    <a href={`mailto:${advisor.email}`} className="text-sm text-[#4A5565] hover:text-[#1A4D3E] flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {advisor.email}
                    </a>
                    {advisor.phone && (
                        <a href={`tel:${advisor.phone}`} className="text-sm text-[#4A5565] hover:text-[#1A4D3E] flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {advisor.phone}
                        </a>
                    )}
                </div>
            </div>
            {!compact && (
                <div className="flex gap-2 mt-4">
                    <Link
                        href="/portal/appointments"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1A4D3E] text-white text-sm font-medium hover:bg-[#1A4D3E]/90 transition-colors"
                    >
                        <Calendar className="h-4 w-4" />
                        Schedule
                    </Link>
                    <Link
                        href="/portal/messages"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#1A4D3E] text-[#1A4D3E] text-sm font-medium hover:bg-[#1A4D3E]/5 transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Message
                    </Link>
                </div>
            )}
        </div>
    )
}
