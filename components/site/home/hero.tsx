'use client'

import { Eyebrow } from '@/components/site/primitives'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="grain relative overflow-hidden bg-ink text-ink-foreground">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--amber) 40%, transparent), transparent 70%)',
        }}
      />
      <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-8 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
        <div className="relative z-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Eyebrow>A SECURE TODAY. REMEMBERED FOREVER.</Eyebrow>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="mt-6 text-balance text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Because when life breaks open, you need something to hold onto.


          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-ink-muted"
          >
            Anchor is your secure digital legacy vault, bringing together important documents, 
            cherished memories, financial records, passwords, and final wishes in one 
            protected place - so the people you love always know where to turn when it matters most.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-base font-semibold text-amber-foreground transition-transform hover:scale-[1.03]"
            >
              Create Your Anchor
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 text-base text-ink-foreground/90 transition-colors hover:text-amber"
            >
              Explore the Vault
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mx-auto aspect-square w-full max-w-lg"
            style={{
              maskImage:
                'radial-gradient(circle at center, black 55%, transparent 78%)',
              WebkitMaskImage:
                'radial-gradient(circle at center, black 55%, transparent 78%)',
            }}
          >
            <Image
              src="/hero-anchor.png"
              alt="A glowing crystal anchor, representing safety and steadiness"
              fill
              priority
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
