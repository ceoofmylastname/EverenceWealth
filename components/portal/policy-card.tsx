import { Shield, Calendar, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'

const policyTypeLabels: Record<string, string> = {
    iul: 'Indexed Universal Life',
    term_life: 'Term Life',
    whole_life: 'Whole Life',
    disability: 'Disability',
    ltc: 'Long-Term Care',
    annuity: 'Annuity',
}

const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    lapsed: 'bg-red-50 text-red-700',
    paid_up: 'bg-blue-50 text-blue-700',
}

interface PolicyCardProps {
    policy: {
        id: string
        policy_type: string
        carrier: string | null
        coverage_amount: number
        premium_amount: number
        premium_frequency: string
        status: string
        next_payment_due: string | null
        cash_value: number
    }
}

export default function PolicyCard({ policy }: PolicyCardProps) {
    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const formatDate = (d: string | null) => {
        if (!d) return 'N/A'
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="bg-white border border-[#4A5565]/10 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1A4D3E]/5">
                        <Shield className="h-5 w-5 text-[#1A4D3E]" />
                    </div>
                    <div>
                        <p className="font-semibold text-[#1A4D3E]">
                            {policyTypeLabels[policy.policy_type] || policy.policy_type}
                        </p>
                        {policy.carrier && (
                            <p className="text-xs text-[#4A5565]">{policy.carrier}</p>
                        )}
                    </div>
                </div>
                <span className={clsx('text-xs font-medium px-2 py-1', statusColors[policy.status] || 'bg-gray-50 text-gray-700')}>
                    {policy.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
            </div>

            <div className="text-3xl font-bold text-[#1A4D3E] mb-4">
                {formatCurrency(policy.coverage_amount)}
                <span className="text-sm font-normal text-[#4A5565] ml-1">coverage</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#4A5565]/10">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#4A5565]" />
                    <div>
                        <p className="text-xs text-[#4A5565]">Premium</p>
                        <p className="text-sm font-medium text-[#1A4D3E]">
                            {formatCurrency(policy.premium_amount)}/{policy.premium_frequency === 'monthly' ? 'mo' : policy.premium_frequency === 'quarterly' ? 'qtr' : 'yr'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#4A5565]" />
                    <div>
                        <p className="text-xs text-[#4A5565]">Next payment</p>
                        <p className="text-sm font-medium text-[#1A4D3E]">
                            {formatDate(policy.next_payment_due)}
                        </p>
                    </div>
                </div>
            </div>

            {policy.cash_value > 0 && (
                <div className="mt-3 pt-3 border-t border-[#4A5565]/10">
                    <p className="text-xs text-[#4A5565]">Cash Value</p>
                    <p className="text-sm font-semibold text-[#1A4D3E]">{formatCurrency(policy.cash_value)}</p>
                </div>
            )}
        </div>
    )
}
