interface StatCardProps {
    label: string
    value: string
    icon: React.ReactNode
    subtitle?: string
}

export default function StatCard({ label, value, icon, subtitle }: StatCardProps) {
    return (
        <div className="bg-white p-6 border border-[#4A5565]/10 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-[#4A5565]">{label}</p>
                    <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-[#4A5565] mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="p-2 bg-[#1A4D3E]/5 text-[#1A4D3E]">
                    {icon}
                </div>
            </div>
        </div>
    )
}
