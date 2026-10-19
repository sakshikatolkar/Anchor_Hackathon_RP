import { cn } from '@/lib/utils'

export function Eyebrow({
  children,
  className,
  tone = 'ink',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'ink' | 'paper'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]',
        tone === 'ink' ? 'text-amber' : 'text-primary',
        className,
      )}
    >
      <span aria-hidden>[</span>
      {children}
      <span aria-hidden>]</span>
    </span>
  )
}

/**
 * Organic wavy divider that transitions between two full-bleed sections.
 * `from` is the color of the section above, `to` is the section below.
 */
export function WaveDivider({
  fill = 'ink',
  flip = false,
  className,
}: {
  fill?: 'ink' | 'paper'
  flip?: boolean
  className?: string
}) {
  const color = fill === 'ink' ? 'var(--ink)' : 'var(--paper)'
  return (
    <div
      className={cn('relative -mb-px w-full leading-[0]', className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn('block h-[60px] w-full md:h-[100px]', flip && 'rotate-180')}
      >
        <path
          d="M0,64 C240,128 480,8 720,40 C960,72 1200,128 1440,72 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
