import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  Bot,
  Brain,
  CalendarCheck,
  FileSearch,
  FolderLock,
  HeartHandshake,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  {
    icon: FolderLock,
    kicker: 'Secure Document Vault',
    title: 'Every important document, organized in one place.',
    body: 'Upload passports, insurance policies, immigration files, leases, medical reports, tax records, loan agreements, property papers, and legal documents. Anchor AI stores the document, category, upload date, visibility, extracted text, and AI summary.',
    points: ['PDF and image upload', 'Document categories', 'Private by default'],
  },
  {
    icon: Brain,
    kicker: 'AI Executive Summary',
    title: 'Complex paperwork, explained in plain language.',
    body: 'Anchor AI reads the uploaded document and explains what it is, why it matters, and what details the family should notice first. The goal is clarity, not legal jargon.',
    points: ['Simple summaries', 'Key details extracted', 'No confusing jargon'],
  },
  {
    icon: FileSearch,
    kicker: 'Pathfinder',
    title: 'Know which related documents you may also need.',
    body: 'A document rarely stands alone. A lease may support immigration address proof. Insurance may need medical reports and identity proof. A loan may connect to property papers, bank statements, and insurance.',
    points: ['Related document map', 'Missing document hints', 'Context-aware suggestions'],
  },
  {
    icon: HeartHandshake,
    kicker: 'Care & Crisis Guidance',
    title: 'Built for disasters, illness, relocation, and family emergencies.',
    body: 'Anchor AI is not only for end-of-life planning. It helps when someone survives a disaster, faces chronic illness, is hospitalized, moves suddenly, handles immigration paperwork, or needs family support quickly.',
    points: ['Calm first steps', 'Practical guidance', 'High-pressure situations'],
  },
  {
    icon: CalendarCheck,
    kicker: 'Next 30 Days Plan',
    title: 'Turn every document into an action plan.',
    body: 'The app suggests practical next steps: renew a passport, verify lease dates, contact an insurance provider, store nominee details, collect missing documents, or keep emergency copies ready.',
    points: ['Expiry checks', 'Missing-item checklist', 'Actionable next steps'],
  },
  {
    icon: KeyRound,
    kicker: 'Role-Based Access',
    title: 'Every document has a lock setting.',
    body: 'Owner can access everything. Family members only see documents explicitly shared with them. Emergency contacts only see documents marked Emergency Only.',
    points: ['Private', 'Shared with Family', 'Emergency Only'],
  },
  {
    icon: Bot,
    kicker: 'Document Q&A Agent',
    title: 'Ask questions across everything you uploaded.',
    body: 'Ask questions like, “Can my lease help with my immigration process?” or “Which insurance document should I use for hospitalization?” The agent answers using only uploaded documents and tells you which files it used.',
    points: ['Grounded answers', 'Uses uploaded files', 'Mentions source documents'],
  },
]

export function FeatureRows() {
  return (
    <section className="bg-[var(--vault-cream)] py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-5 md:gap-28 md:px-8">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon
          const flip = index % 2 === 1

          return (
            <Reveal key={feature.kicker}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Text */}
                <div className={cn(flip && 'lg:order-2')}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--vault-night)] text-[var(--vault-cream)] shadow-lg">
                    <Icon className="h-6 w-6" />
                  </span>

                  <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-[var(--vault-steel)]">
                    {feature.kicker}
                  </p>

                  <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--vault-night)] md:text-4xl">
                    {feature.title}
                  </h2>

                  <p className="mt-4 text-pretty text-lg leading-relaxed text-[var(--vault-steel)]">
                    {feature.body}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {feature.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-[rgba(13,19,33,0.14)] bg-[#f7f2df] px-3 py-1.5 text-sm font-medium text-[var(--vault-night)]"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual mock */}
                <div className={cn(flip && 'lg:order-1')}>
                  <FeatureVisual index={index} />
                </div>
              </div>
            </Reveal>
          )
        })}

        <Reveal className="text-center">
          <Link
            href="/upload"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--vault-night)] px-7 py-4 text-base font-semibold text-[var(--vault-cream)] transition-transform hover:scale-[1.03]"
          >
            Open the upload vault
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function FeatureVisual({ index }: { index: number }) {
  const visuals = [
    <div key="vault" className="space-y-3">
      <MockField label="Document" value="Passport.pdf" />
      <MockField label="Category" value="Identity" />
      <MockField label="Visibility" value="Private" accent />
      <MockField label="Uploaded" value="Today" />
    </div>,

    <div key="summary" className="space-y-3">
      <div className="rounded-2xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--vault-blue)]">
          AI Summary
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--vault-cream)]/80">
          This passport confirms identity and citizenship. It may be needed for
          travel, immigration filings, banking, and emergency verification.
        </p>
      </div>
      <MockDarkField label="Key date" value="Expires May 2027" />
    </div>,

    <div key="pathfinder" className="space-y-3">
      <MockFieldDark label="Current document" value="Lease Agreement" />
      <div className="grid grid-cols-2 gap-2">
        <MiniPill text="Immigration file" />
        <MiniPill text="Passport" />
        <MiniPill text="Bank statement" />
        <MiniPill text="Address proof" />
      </div>
    </div>,

    <div key="care" className="space-y-3">
      <MockTask text="Confirm the document type" done />
      <MockTask text="Find the policy or case number" done />
      <MockTask text="Call the provider or office listed" />
      <MockTask text="Share only with approved contact" />
    </div>,

    <div key="plan" className="space-y-3">
      <MockAlert text="Passport expires in 90 days" tone="info" />
      <MockAlert text="Lease end date needs verification" tone="info" />
      <MockAlert text="Insurance nominee details missing" tone="warn" />
    </div>,

    <div key="access" className="space-y-3">
      <MockField label="Owner" value="All documents" accent />
      <MockField label="Family" value="Shared only" />
      <MockField label="Emergency" value="Emergency Only" />
      <div className="rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-3 text-sm text-[var(--vault-cream)]/75">
        Nothing is shared by mistake.
      </div>
    </div>,

    <div key="agent" className="space-y-3">
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--vault-blue)] px-4 py-2.5 text-sm font-medium text-[var(--vault-night)]">
        Can my lease help with immigration?
      </div>
      <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-sm bg-[rgba(240,235,216,0.1)] px-4 py-3 text-sm leading-6 text-[var(--vault-cream)]/80">
        Yes. Your uploaded lease may help as address proof. I used
        Lease_Agreement.pdf and Immigration_I20.pdf.
      </div>
    </div>,
  ]

  return (
    <div className="rounded-3xl border border-[rgba(240,235,216,0.14)] bg-[var(--vault-navy)] p-5 shadow-2xl md:p-7">
      {visuals[index]}
    </div>
  )
}

function MockField({
  label,
  value,
  accent,
  warn,
}: {
  label: string
  value: string
  accent?: boolean
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-3">
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--vault-blue)]">
        {label}
      </span>

      <span
        className={cn(
          'text-sm font-medium',
          accent
            ? 'text-[var(--vault-cream)]'
            : warn
              ? 'text-red-300'
              : 'text-[var(--vault-cream)]/75',
        )}
      >
        {value}
      </span>
    </div>
  )
}

function MockDarkField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-3">
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--vault-blue)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--vault-cream)]">
        {value}
      </span>
    </div>
  )
}

function MockFieldDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-4">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--vault-blue)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--vault-cream)]">
        {value}
      </p>
    </div>
  )
}

function MiniPill({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-3 py-3 text-sm font-medium text-[var(--vault-cream)]/80">
      {text}
    </div>
  )
}

function MockAlert({ text, tone }: { text: string; tone: 'warn' | 'info' }) {
  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3 text-sm',
        tone === 'warn'
          ? 'border-[rgba(116,140,171,0.45)] bg-[rgba(116,140,171,0.18)] text-[var(--vault-cream)]'
          : 'border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] text-[var(--vault-cream)]/75',
      )}
    >
      {text}
    </div>
  )
}

function MockTask({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[rgba(240,235,216,0.14)] bg-[rgba(240,235,216,0.08)] px-4 py-3">
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
          done
            ? 'border-[var(--vault-blue)] bg-[var(--vault-blue)] text-[var(--vault-night)]'
            : 'border-[rgba(240,235,216,0.28)]',
        )}
      >
        {done && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2.5 6.5L5 9l4.5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span
        className={cn(
          'text-sm',
          done
            ? 'text-[var(--vault-blue)] line-through'
            : 'text-[var(--vault-cream)]/80',
        )}
      >
        {text}
      </span>
    </div>
  )
}