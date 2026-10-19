'use client'

import { Eyebrow } from '@/components/site/primitives'
import { motion, useReducedMotion } from 'motion/react'

export function PageHero({
  eyebrow,
  title,
  italic,
  subtitle,
}: {
  eyebrow: string
  title: string
  italic: string
  subtitle: string
}) {
  const reduce = useReducedMotion()
  return (
    <section className="grain relative overflow-hidden bg-ink text-ink-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--amber) 45%, transparent), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-36 text-center md:px-8 md:pb-24 md:pt-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
        >
          {title}{' '}
          <span className="font-serif italic text-amber">{italic}</span>
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  )
}
