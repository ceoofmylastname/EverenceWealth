'use client'

import { useEffect } from 'react'

export default function ScrollReveal({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view')
                }
            })
        }, { threshold: 0.1 })

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return <>{children}</>
}
