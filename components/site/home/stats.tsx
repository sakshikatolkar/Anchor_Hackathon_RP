import { AnimatedCounter } from '@/components/site/animated-counter'
import { Eyebrow } from '@/components/site/primitives'
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal'

const STATS = [
  {
    prefix: '',
    value: 168,
    suffix: '+',
    label: 'Online accounts managed by the average person.',
    href: 'https://digitallegacyassociation.org/',
  },
  {
    prefix: '',
    value: 83,
    suffix: '%',
    label: 'Believe estate planning is important, yet only 31% have a will.',
    href: 'https://trustandwill.com/learn/estate-planning-report-2025',
  },
  {
    value: 48,
    suffix: '%',
    label: 'Leave no instructions for their digital accounts and assets.',
    href: 'https://www.prnewswire.com/news-releases/trust--wills-2026-estate-planning-report-56-of-americans-still-have-no-estate-plan-ai-trust-hits-an-all-time-high-302735330.html?utm_source=chatgpt.com',
  },
  {
    value: 79,
    suffix: '%',
    label: 'Of human life is spent in the digital world.',
    href: 'https://www.reviews.org/internet-service/internet-screen-time-statistics/?utm_source=chatgpt.com',
  },
]

export function Stats() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <Eyebrow tone="paper">The Reality</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            Some things are too important
            <span className="font-serif italic text-primary">
              {' '}
              to leave scattered.
            </span>
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2">
  <p className="font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
    {s.prefix}
    <AnimatedCounter value={s.value} />
    {s.suffix}
  </p>

  <a
    href={s.href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground text-lg"
  >
    ↗
  </a>
</div>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          Every year, families lose access to important memories, financial records, and critical documents - not because they don't exist, but because no one knows where to find them.
        </p>
      </div>
    </section>
  )
}
