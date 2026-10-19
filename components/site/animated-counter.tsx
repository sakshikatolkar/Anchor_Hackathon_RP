'use client'

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from 'motion/react'
import { useEffect, useRef } from 'react'

type AnimatedCounterProps = {
  value: number
  durationMs?: number
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  value,
  durationMs = 1800,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const count = useMotionValue(value)
  const rounded = useTransform(count, (latest) =>
    latest.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  )

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value)
      return
    }
    count.set(0)
    const controls = animate(count, value, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [inView, value, durationMs, reduce, count])

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>
}
