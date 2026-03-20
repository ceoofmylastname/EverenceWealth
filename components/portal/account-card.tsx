import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

const accountTypeLabels: Record<string, string> = {
    iul_cash_value: 'IUL Cash Value',
    indexed_annuity: 'Indexed Annuity',
    brokerage: 'Brokerage',
    ira: 'Traditional IRA',
    roth_ira: 'Roth IRA',
    '401k': '401(k)',
}

const taxBucketLabels: Record<string, string> = {
    taxable: 'Taxable',
    tax_deferred: 'Tax-Deferred',
    tax_exempt: 'Tax-Exempt',
}

const taxBucketColors: Record<string, string> = {
    taxable: 'bg-orange-50 text-orange-700',
    tax_deferred: 'bg-blue-50 text-blue-700',
    tax_exempt: 'bg-emerald-50 text-emerald-700',
}

interface AccountCardProps {
    account: {
        id: string
        account_type: string
        account_number: string | null
        tax_bucket: string
        current_value: number
        contribution_ytd: number
        gain_loss_ytd: number
        status: string
    }
}

export default function AccountCard({ account }: AccountCardProps) {
    const formatCurrency = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const maskedNumber = account.account_number
        ? `****${account.account_number.slice(-4)}`
        : 'N/A'

    const isPositive = account.gain_loss_ytd >= 0

    return (
        <div className="bg-white border border-[#4A5565]/10 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1A4D3E]/5">
                        <Wallet className="h-5 w-5 text-[#1A4D3E]" />
                    </div>
                    <div>
                        <p className="font-semibold text-[#1A4D3E]">
                            {accountTypeLabels[account.account_type] || account.account_type}
                        </p>
                        <p className="text-xs text-[#4A5565]">{maskedNumber}</p>
                    </div>
                </div>
                <span className={clsx('text-xs font-medium px-2 py-1', taxBucketColors[account.tax_bucket] || 'bg-gray-50 text-gray-700')}>
                    {taxBucketLabels[account.tax_bucket] || account.tax_bucket}
                </span>
            </div>

            <div className="text-3xl font-bold text-[#1A4D3E] mb-4">
                {formatCurrency(account.current_value)}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#4A5565]/10">
                <div>
                    <p className="text-xs text-[#4A5565]">YTD Contributions</p>
                    <p className="text-sm font-medium text-[#1A4D3E]">
                        {formatCurrency(account.contribution_ytd)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[#4A5565]">YTD Gain/Loss</p>
                    <p className={clsx('text-sm font-medium flex items-center gap-1', isPositive ? 'text-emerald-600' : 'text-red-600')}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isPositive ? '+' : ''}{formatCurrency(account.gain_loss_ytd)}
                    </p>
                </div>
            </div>
        </div>
    )
}
