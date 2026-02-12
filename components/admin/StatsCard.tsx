'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
}

export default function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    return (
        <div className="glass-card flex flex-col justify-between h-32 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-white mt-4">{value}</div>
        </div>
    )
}
