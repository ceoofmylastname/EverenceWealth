'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    className?: string
}

export default function CountUp({ end, duration = 2000, prefix = '', suffix = '', decimals = 0, className = '' }: CountUpProps) {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasStarted) {
                setHasStarted(true)
            }
        }, { threshold: 0.3 })

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasStarted])

    useEffect(() => {
        if (!hasStarted) return

        const startTime = performance.now()

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(eased * end)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [hasStarted, end, duration])

    const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()

    return (
        <span ref={ref} className={className}>
            {prefix}{formatted}{suffix}
        </span>
    )
}
