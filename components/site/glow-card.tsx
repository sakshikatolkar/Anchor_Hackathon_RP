'use client'

import { cn } from '@/lib/utils'
import { useRef, type ReactNode } from 'react'

/**
 * Card with an amber glow that follows the pointer, echoing Henedo's
 * soft-lit cards. Works on both ink and paper sections.
 */
export function GlowCard({
  children,
  className,
  tone = 'paper',
}: {
  children: ReactNode
  className?: string
  tone?: 'ink' | 'paper'
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        'group relative overflow-hidden rounded-3xl border p-7 transition-colors duration-300',
        tone === 'ink'
          ? 'border-ink-border bg-ink-card'
          : 'border-border bg-card',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(280px circle at var(--mx) var(--my), color-mix(in oklch, var(--amber) 22%, transparent), transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
