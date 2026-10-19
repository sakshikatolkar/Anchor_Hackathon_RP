import { GlowCard } from '@/components/site/glow-card'
import { Eyebrow } from '@/components/site/primitives'
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal'

const VAULT_CATEGORIES = [
  {
    icon: '📄',
    title: 'Legal Documents',
    items: ['Will', 'Power of Attorney', 'Trusts', 'Birth Certificate'],
  },
  {
    icon: '🏦',
    title: 'Financial Assets',
    items: [
      'Bank Accounts',
      'Loans',
      'Credit Cards',
      'Insurance Policies',
    ],
  },
  {
    icon: '📈',
    title: 'Investments',
    items: [
      'Stocks',
      'Mutual Funds',
      'Crypto',
      'Retirement Accounts',
    ],
  },
  {
    icon: '🏡',
    title: 'Property',
    items: [
      'Land',
      'House Documents',
      'Vehicle Titles',
      'Lease Agreements',
    ],
  },
  {
    icon: '🔐',
    title: 'Digital Life',
    items: [
      'Passwords',
      'Subscriptions',
      'Email Accounts',
      'Cloud Storage',
    ],
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Trusted Contacts',
    items: [
      'Family',
      'Lawyers',
      'Financial Advisors',
      'Emergency Contacts',
    ],
  },
  {
    icon: '🎥',
    title: 'Personal Memories',
    items: [
      'Photos',
      'Videos',
      'Letters',
      'Voice Messages',
    ],
  },
  {
    icon: '📋',
    title: 'Personal Instructions',
    items: [
      'Medical Information',
      'Pet Care',
      'Funeral Wishes',
      'Family Notes',
    ],
  },
]

export function HowItWorks() {
  return (
    <section
      id="how"
      className="grain bg-ink py-20 text-ink-foreground md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Your Digital HQ</Eyebrow>

          <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your one-stop vault
            <span className="font-serif italic text-primary">
              {' '}
              for everything important.
            </span>
          </h2>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-muted">
            Anchor makes it simple. Whether you're planning for tomorrow or
            preparing for the unexpected, everything important lives in one
            secure place.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {VAULT_CATEGORIES.map((category) => (
            <StaggerItem key={category.title}>
              <GlowCard tone="ink" className="h-full">
                <div className="text-3xl">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-2xl font-medium tracking-tight">
                  {category.title}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-20 text-center">
            <p className="font-serif text-3xl text-ink-foreground">
              Everything important.
            </p>

            <p className="mt-2 text-4xl font-serif text-white">
              One secure Anchor.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}