'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { X, ChevronDown, ChevronLeft, ChevronRight, Loader2, Send, User, Mail, Phone, Sparkles, Target, TrendingUp, Shield, DollarSign, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'

// ────────────────── Context ──────────────────
interface ModalContextType {
    openModal: () => void
    closeModal: () => void
    isOpen: boolean
}

const ModalContext = createContext<ModalContextType>({
    openModal: () => {},
    closeModal: () => {},
    isOpen: false,
})

export const useAssessmentModal = () => useContext(ModalContext)

export function AssessmentModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const openModal = useCallback(() => {
        setShowSuccess(false)
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
        setShowSuccess(false)
    }, [])

    const onSubmitSuccess = useCallback(() => {
        setIsOpen(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 6000)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
            {children}
            {isOpen && <AssessmentModal onSuccess={onSubmitSuccess} />}
            {showSuccess && <CongratsBanner onClose={() => setShowSuccess(false)} />}
        </ModalContext.Provider>
    )
}

// ────────────────── Step Definitions ──────────────────
const TOTAL_STEPS = 4

const INCOME_RANGES = [
    'Under $100,000',
    '$100,000 – $250,000',
    '$250,000 – $500,000',
    '$500,000 – $1,000,000',
    '$1,000,000+',
    'Prefer not to say',
]

const ASSET_RANGES = [
    'Under $100,000',
    '$100,000 – $500,000',
    '$500,000 – $1,000,000',
    '$1,000,000 – $5,000,000',
    '$5,000,000+',
    'Prefer not to say',
]

const EMPLOYMENT_OPTIONS = [
    'Employed (W-2)',
    'Self-Employed / 1099',
    'Business Owner',
    'Retired',
    'Other',
]

const FINANCIAL_GOALS = [
    { label: 'Tax-Free Retirement Income', icon: '🏖️' },
    { label: 'Wealth Accumulation & Growth', icon: '📈' },
    { label: 'Tax Optimization Strategy', icon: '🛡️' },
    { label: 'Legacy & Estate Planning', icon: '🏛️' },
    { label: 'Cash Flow & Passive Income', icon: '💰' },
    { label: 'Asset & Wealth Protection', icon: '🔒' },
]

const RETIREMENT_TIMELINES = [
    'Already retired',
    'Within 5 years',
    '5 – 10 years',
    '10 – 20 years',
    '20+ years',
    'Not sure yet',
]

const RISK_LEVELS = [
    { label: 'Conservative', desc: 'Protect what I have' },
    { label: 'Moderate', desc: 'Balanced growth & safety' },
    { label: 'Growth-Oriented', desc: 'Maximize long-term returns' },
    { label: 'Aggressive', desc: 'Highest growth potential' },
]

const CONCERN_OPTIONS = [
    'Market volatility & losses',
    'Rising taxes eating returns',
    'Hidden fees eroding wealth',
    'Inflation reducing buying power',
    'Running out of money in retirement',
    'Not enough accessible cash flow',
]

const INTEREST_AREAS = [
    'Tax-Free Retirement Strategies',
    'Indexed Universal Life (IUL)',
    'Cash Flow Optimization',
    'Asset Protection Planning',
    'Legacy & Estate Planning',
    'Fee & Expense Analysis',
    'Volatility Protection',
    'Human Life Value Planning',
]

// ────────────────── Congratulations Banner ──────────────────
function CongratsBanner({ onClose }: { onClose: () => void }) {
    const [opacity, setOpacity] = useState(1)

    useEffect(() => {
        const fadeTimer = setTimeout(() => setOpacity(0), 4500)
        const removeTimer = setTimeout(onClose, 6000)
        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(removeTimer)
        }
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center px-4 pointer-events-none"
            style={{ opacity, transition: 'opacity 1.5s ease-out' }}
        >
            <div className="pointer-events-auto relative overflow-hidden rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-[#0a1f1a]/98 via-[#0d2b23]/98 to-[#1A4D3E]/90 px-10 py-10 md:px-16 md:py-12 shadow-[0_40px_120px_rgba(0,0,0,0.7),_0_0_60px_rgba(16,185,129,0.15)] backdrop-blur-2xl text-center max-w-lg w-full" style={{ animation: 'modalSlideUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

                {/* Icon */}
                <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={2} />
                </div>

                <h3 className="relative font-space-grotesk text-3xl md:text-4xl font-bold text-white mb-3">
                    Congratulations!
                </h3>
                <p className="relative text-base md:text-lg text-white/80 mb-2">
                    Your Financial Needs Assessment has been submitted.
                </p>
                <p className="relative text-sm text-white/50">
                    A member of our team will reach out within 24 hours to schedule your personalized consultation.
                </p>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="pointer-events-auto absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}

// ────────────────── Confetti ──────────────────
function fireConfetti() {
    const duration = 2500
    const end = Date.now() + duration

    const frame = () => {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.65 },
            colors: ['#1A4D3E', '#10B981', '#34D399', '#ffffff'],
        })
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.65 },
            colors: ['#1A4D3E', '#10B981', '#34D399', '#ffffff'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
    }

    // Big initial burst from both sides
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.05, y: 0.6 },
        colors: ['#1A4D3E', '#10B981', '#34D399', '#ffffff', '#F59E0B'],
        angle: 60,
        gravity: 0.8,
        ticks: 300,
    })
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.95, y: 0.6 },
        colors: ['#1A4D3E', '#10B981', '#34D399', '#ffffff', '#F59E0B'],
        angle: 120,
        gravity: 0.8,
        ticks: 300,
    })

    // Continuous stream
    frame()

    // Center burst delayed
    setTimeout(() => {
        confetti({
            particleCount: 80,
            spread: 140,
            origin: { x: 0.5, y: 0.4 },
            colors: ['#1A4D3E', '#10B981', '#34D399', '#F59E0B'],
            gravity: 1,
            scalar: 1.2,
            ticks: 250,
        })
    }, 400)

    // Second wave from sides
    setTimeout(() => {
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.1, y: 0.5 },
            colors: ['#10B981', '#34D399', '#ffffff'],
            angle: 55,
            gravity: 0.9,
            ticks: 200,
        })
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.9, y: 0.5 },
            colors: ['#10B981', '#34D399', '#ffffff'],
            angle: 125,
            gravity: 0.9,
            ticks: 200,
        })
    }, 800)
}

// ────────────────── Option Button ──────────────────
function OptionButton({ selected, onClick, children, className = '' }: {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
    className?: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-xl border px-4 py-3 text-left text-[13px] transition-all duration-200 ${
                selected
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/15 hover:bg-white/[0.05]'
            } ${className}`}
        >
            {children}
        </button>
    )
}

// ────────────────── Checkbox Button ──────────────────
function CheckboxButton({ selected, onClick, children }: {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left text-[13px] transition-all duration-200 ${
                selected
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/15 hover:bg-white/[0.05]'
            }`}
        >
            <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all ${
                selected ? 'border-emerald-400 bg-emerald-500/30' : 'border-white/20 bg-white/5'
            }`}>
                {selected && <span className="text-[10px] text-emerald-300">&#10003;</span>}
            </div>
            {children}
        </button>
    )
}

// ────────────────── Dropdown ──────────────────
function Dropdown({ value, options, onChange, placeholder, error }: {
    value: string
    options: string[]
    onChange: (v: string) => void
    placeholder: string
    error?: boolean
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [open])

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center justify-between rounded-xl border bg-white/[0.03] px-4 py-3 text-left text-[13px] outline-none transition-all duration-200 hover:border-white/15 ${
                    error
                        ? 'border-red-500/50 text-white/80'
                        : value
                            ? 'border-emerald-400/30 text-white'
                            : 'border-white/[0.08] text-white/30'
                }`}
            >
                <span>{value || placeholder}</span>
                <ChevronDown size={14} className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0d2118] py-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" style={{ animation: 'modalFadeIn 0.15s ease-out' }}>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false) }}
                            className={`flex w-full items-center px-4 py-2.5 text-left text-[13px] transition-colors ${
                                value === opt
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            {value === opt && <span className="mr-2 text-emerald-400">&#10003;</span>}
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ────────────────── Modal ──────────────────
function AssessmentModal({ onSuccess }: { onSuccess: () => void }) {
    const { closeModal } = useAssessmentModal()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const [form, setForm] = useState({
        // Step 1: Contact
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        // Step 2: Financial Snapshot
        income: '',
        assets: '',
        employment: '',
        hasAdvisor: '',
        // Step 3: Goals & Timeline
        goals: [] as string[],
        retirementTimeline: '',
        riskLevel: '',
        concerns: [] as string[],
        // Step 4: Interests
        interests: [] as string[],
        additionalInfo: '',
    })

    const updateField = (key: string, value: string | string[]) => {
        setForm(f => ({ ...f, [key]: value }))
        if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    }

    const toggleArrayField = (key: 'goals' | 'concerns' | 'interests', value: string) => {
        setForm(f => {
            const arr = f[key] as string[]
            const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
            return { ...f, [key]: next }
        })
        if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    }

    const validateStep = (s: number) => {
        const errs: Record<string, string> = {}
        if (s === 1) {
            if (!form.firstName.trim()) errs.firstName = 'Required'
            if (!form.lastName.trim()) errs.lastName = 'Required'
            if (!form.email.trim()) errs.email = 'Required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
            if (!form.phone.trim()) errs.phone = 'Required'
        }
        if (s === 2) {
            if (!form.income) errs.income = 'Please select'
            if (!form.employment) errs.employment = 'Please select'
        }
        if (s === 3) {
            if (form.goals.length === 0) errs.goals = 'Select at least one'
            if (!form.retirementTimeline) errs.retirementTimeline = 'Please select'
            if (!form.riskLevel) errs.riskLevel = 'Please select'
        }
        return errs
    }

    const goNext = () => {
        const errs = validateStep(step)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})
        setDirection('forward')
        setStep(s => Math.min(s + 1, TOTAL_STEPS))
    }

    const goBack = () => {
        setErrors({})
        setDirection('back')
        setStep(s => Math.max(s - 1, 1))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        onSuccess()
        fireConfetti()
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) closeModal()
    }

    const inputClass = (key: string) =>
        `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder-white/25 outline-none transition-all duration-200 ${
            errors[key]
                ? 'border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                : 'border-white/[0.08] focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 hover:border-white/15'
        }`

    const STEP_ICONS = [
        <User key="u" size={14} />,
        <DollarSign key="d" size={14} />,
        <Target key="t" size={14} />,
        <Sparkles key="s" size={14} />,
    ]

    const STEP_LABELS = ['About You', 'Financial Snapshot', 'Goals & Timeline', 'Your Interests']

    // ── Step content ──
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                    First Name <span className="text-emerald-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={e => updateField('firstName', e.target.value)}
                                    placeholder="John"
                                    className={inputClass('firstName')}
                                />
                                {errors.firstName && <p className="mt-1 text-[11px] text-red-400">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                    Last Name <span className="text-emerald-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={e => updateField('lastName', e.target.value)}
                                    placeholder="Smith"
                                    className={inputClass('lastName')}
                                />
                                {errors.lastName && <p className="mt-1 text-[11px] text-red-400">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <Mail size={11} /> Email <span className="text-emerald-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => updateField('email', e.target.value)}
                                placeholder="john@example.com"
                                className={inputClass('email')}
                            />
                            {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <Phone size={11} /> Phone <span className="text-emerald-400">*</span>
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => updateField('phone', e.target.value)}
                                placeholder="(555) 123-4567"
                                className={inputClass('phone')}
                            />
                            {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>}
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <DollarSign size={11} /> Annual Household Income <span className="text-emerald-400">*</span>
                            </label>
                            <Dropdown
                                value={form.income}
                                options={INCOME_RANGES}
                                onChange={v => updateField('income', v)}
                                placeholder="Select income range"
                                error={!!errors.income}
                            />
                            {errors.income && <p className="mt-1 text-[11px] text-red-400">{errors.income}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <TrendingUp size={11} /> Investable Assets <span className="text-white/20">(optional)</span>
                            </label>
                            <Dropdown
                                value={form.assets}
                                options={ASSET_RANGES}
                                onChange={v => updateField('assets', v)}
                                placeholder="Select asset range"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                Employment Status <span className="text-emerald-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {EMPLOYMENT_OPTIONS.map((opt) => (
                                    <OptionButton
                                        key={opt}
                                        selected={form.employment === opt}
                                        onClick={() => updateField('employment', opt)}
                                    >
                                        {opt}
                                    </OptionButton>
                                ))}
                            </div>
                            {errors.employment && <p className="mt-1 text-[11px] text-red-400">{errors.employment}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                Do you currently work with a financial advisor?
                            </label>
                            <div className="flex gap-2">
                                {['Yes', 'No', 'Not sure'].map((opt) => (
                                    <OptionButton
                                        key={opt}
                                        selected={form.hasAdvisor === opt}
                                        onClick={() => updateField('hasAdvisor', opt)}
                                        className="flex-1 text-center"
                                    >
                                        {opt}
                                    </OptionButton>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <Target size={11} /> Primary Financial Goal(s) <span className="text-emerald-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {FINANCIAL_GOALS.map((goal) => (
                                    <OptionButton
                                        key={goal.label}
                                        selected={form.goals.includes(goal.label)}
                                        onClick={() => toggleArrayField('goals', goal.label)}
                                    >
                                        <span className="mr-1.5">{goal.icon}</span> {goal.label}
                                    </OptionButton>
                                ))}
                            </div>
                            {errors.goals && <p className="mt-1 text-[11px] text-red-400">{errors.goals}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                Retirement Timeline <span className="text-emerald-400">*</span>
                            </label>
                            <Dropdown
                                value={form.retirementTimeline}
                                options={RETIREMENT_TIMELINES}
                                onChange={v => updateField('retirementTimeline', v)}
                                placeholder="When do you plan to retire?"
                                error={!!errors.retirementTimeline}
                            />
                            {errors.retirementTimeline && <p className="mt-1 text-[11px] text-red-400">{errors.retirementTimeline}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <Shield size={11} /> Risk Tolerance <span className="text-emerald-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {RISK_LEVELS.map((r) => (
                                    <OptionButton
                                        key={r.label}
                                        selected={form.riskLevel === r.label}
                                        onClick={() => updateField('riskLevel', r.label)}
                                    >
                                        <div>
                                            <div className="font-medium">{r.label}</div>
                                            <div className="text-[11px] text-white/40">{r.desc}</div>
                                        </div>
                                    </OptionButton>
                                ))}
                            </div>
                            {errors.riskLevel && <p className="mt-1 text-[11px] text-red-400">{errors.riskLevel}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                Biggest Financial Concerns <span className="text-white/20">(select any)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CONCERN_OPTIONS.map((c) => (
                                    <CheckboxButton
                                        key={c}
                                        selected={form.concerns.includes(c)}
                                        onClick={() => toggleArrayField('concerns', c)}
                                    >
                                        {c}
                                    </CheckboxButton>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                <Sparkles size={11} /> Which areas interest you? <span className="text-white/20">(select any)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INTEREST_AREAS.map((area) => (
                                    <CheckboxButton
                                        key={area}
                                        selected={form.interests.includes(area)}
                                        onClick={() => toggleArrayField('interests', area)}
                                    >
                                        {area}
                                    </CheckboxButton>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                Anything specific you&apos;d like us to address? <span className="text-white/20">(optional)</span>
                            </label>
                            <textarea
                                value={form.additionalInfo}
                                onChange={e => updateField('additionalInfo', e.target.value)}
                                placeholder="Tell us about your situation, questions, or anything you'd like us to know..."
                                rows={4}
                                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder-white/25 outline-none transition-all duration-200 hover:border-white/15 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
                            />
                        </div>

                        {/* Summary */}
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/70">Assessment Summary</p>
                            <div className="space-y-1.5 text-[12px] text-white/50">
                                <p><span className="text-white/70">Name:</span> {form.firstName} {form.lastName}</p>
                                {form.income && <p><span className="text-white/70">Income:</span> {form.income}</p>}
                                {form.goals.length > 0 && <p><span className="text-white/70">Goals:</span> {form.goals.join(', ')}</p>}
                                {form.riskLevel && <p><span className="text-white/70">Risk profile:</span> {form.riskLevel}</p>}
                                {form.retirementTimeline && <p><span className="text-white/70">Timeline:</span> {form.retirementTimeline}</p>}
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6"
            style={{ animation: 'modalFadeIn 0.25s ease-out' }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

            {/* Modal */}
            <div
                className="relative z-10 flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#0d2118] to-[#081510] shadow-[0_50px_150px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.05)]"
                style={{ animation: 'modalSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}
            >
                {/* Top accent */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

                {/* Header */}
                <div className="relative flex-shrink-0 px-8 pb-2 pt-6">
                    <button
                        onClick={closeModal}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>

                    <div className="mb-1 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
                            <Sparkles size={12} className="text-emerald-400" />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400/80">Financial Needs Assessment</span>
                    </div>
                    <h2 className="font-space-grotesk text-[20px] font-bold leading-tight text-white">
                        {STEP_LABELS[step - 1]}
                    </h2>
                    <p className="mt-1 text-[13px] text-white/40">
                        Step {step} of {TOTAL_STEPS}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-4 flex items-center gap-2">
                        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                            <div key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                                    style={{ width: i < step ? '100%' : i === step ? '0%' : '0%' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Step indicators */}
                    <div className="mt-3 flex items-center justify-between">
                        {STEP_LABELS.map((label, i) => (
                            <div key={label} className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors duration-300 ${
                                i + 1 <= step ? 'text-emerald-400/80' : 'text-white/20'
                            }`}>
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                                    i + 1 < step
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : i + 1 === step
                                            ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30'
                                            : 'bg-white/5 text-white/20'
                                }`}>
                                    {i + 1 < step ? <CheckCircle2 size={12} /> : STEP_ICONS[i]}
                                </div>
                                <span className="hidden sm:inline">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-8 my-3 h-px flex-shrink-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Step content */}
                <div ref={contentRef} className="flex-1 overflow-y-auto px-8 pb-4 scrollbar-thin">
                    <div key={step} style={{ animation: direction === 'forward' ? 'stepSlideIn 0.3s ease-out' : 'stepSlideBack 0.3s ease-out' }}>
                        {renderStep()}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-white/[0.06] bg-white/[0.02] px-8 py-4">
                    <div className="flex items-center justify-between gap-3">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-white/60 transition-all hover:border-white/15 hover:text-white/80"
                            >
                                <ChevronLeft size={14} /> Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < TOTAL_STEPS ? (
                            <button
                                type="button"
                                onClick={goNext}
                                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#1A4D3E] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)]"
                            >
                                Continue <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-[#1A4D3E] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)] disabled:pointer-events-none disabled:opacity-60"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="relative">Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} className="relative" />
                                        <span className="relative">Submit Assessment</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Trust line */}
                    <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-white/20">
                        <span>No spam</span>
                        <span className="h-2.5 w-px bg-white/10" />
                        <span>100% confidential</span>
                        <span className="h-2.5 w-px bg-white/10" />
                        <span>Free consultation</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
