import { Eyebrow } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Legacy() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/legacy-hands.png"
              alt="An older parent's hands passing a warm light into a younger person's hands"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow tone="paper">WHEN LIFE CHANGES</Eyebrow>
          <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            The unexpected doesn't wait.
            <span className="font-serif italic text-primary"> Neither should your plan.</span>
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Life can change in an instant.
            A natural disaster.
            An accident.
            A medical emergency.
            A sudden hospitalization.
            Or simply being away when someone needs access to something important.
          </p>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Anchor ensures the people you trust can find exactly what they need - without confusion, 
            delays, or uncertainty.
            </p>
          <ul className="mt-8 space-y-3">
            {[
              'Share important documents with trusted contacts.',
              'Leave instructions for life\'s unexpected moments.',
              'Preserve memories, messages, and family history for generations.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-ink-foreground md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--amber) 50%, transparent), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <Eyebrow>Start Today</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
            Give them a map,
            <span className="block font-serif italic text-amber text-glow-amber">
              not a mystery.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-ink-muted">
            See exactly how Anchor turns a crisis into a calm, guided plan.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 rounded-full bg-amber px-7 py-4 text-base font-semibold text-amber-foreground transition-transform hover:scale-[1.03]"
            >
              Create your Anchor
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border border-ink-border px-7 py-4 text-base font-semibold text-ink-foreground transition-colors hover:border-amber hover:text-amber"
            >
              View features
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
