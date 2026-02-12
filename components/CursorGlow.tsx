'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
    const glowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Only on desktop (no touch devices)
        if (typeof window === 'undefined' || 'ontouchstart' in window) return

        const glow = glowRef.current
        if (!glow) return

        let mouseX = 0
        let mouseY = 0
        let currentX = 0
        let currentY = 0
        let rafId: number

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
            glow.style.opacity = '1'
        }

        const onMouseLeave = () => {
            glow.style.opacity = '0'
        }

        // Smooth follow with lerp
        const animate = () => {
            currentX += (mouseX - currentX) * 0.15
            currentY += (mouseY - currentY) * 0.15
            glow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`
            rafId = requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseleave', onMouseLeave)
        rafId = requestAnimationFrame(animate)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseleave', onMouseLeave)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <div
            ref={glowRef}
            className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[300px] w-[300px] rounded-full opacity-0 transition-opacity duration-300 lg:block"
            style={{
                background: 'radial-gradient(circle, rgba(26,77,62,0.15) 0%, rgba(26,77,62,0.05) 40%, transparent 70%)',
                willChange: 'transform',
            }}
        />
    )
}
