'use client'

interface FinancialHealthGaugeProps {
    score: number
}

export default function FinancialHealthGauge({ score }: FinancialHealthGaugeProps) {
    const circumference = 2 * Math.PI * 58
    const offset = circumference - (score / 100) * circumference

    const getColor = () => {
        if (score >= 80) return '#1A4D3E'
        if (score >= 60) return '#D97706'
        return '#DC2626'
    }

    const getLabel = () => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Needs Attention'
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="none"
                        stroke={getColor()}
                        strokeWidth="8"
                        strokeLinecap="butt"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#1A4D3E]">{score}</span>
                    <span className="text-xs text-[#4A5565]">/ 100</span>
                </div>
            </div>
            <p className="mt-2 text-sm font-medium" style={{ color: getColor() }}>
                {getLabel()}
            </p>
        </div>
    )
}
