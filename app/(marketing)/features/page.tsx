import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  FileSearch,
  HeartHandshake,
  Lock,
  Plus,
  ShieldCheck,
  Upload,
} from 'lucide-react'

const FEATURES = [
  {
    id: 'upload',
    tag: 'SECURE UPLOAD',
    title: '100 GB, end-to-end encrypted.',
    body: 'Insurance, deeds, tax records, password vault, recovery codes, all stored zero-knowledge under a key only you hold. The server never sees plaintext.',
    bullets: [
      'AES-256-GCM with Argon2id-derived keys',
      'Device-bound Account Secret Key',
      'Open formats. Free export, anytime',
    ],
    icon: Upload,
  },
  {
    id: 'summary',
    tag: 'Privacy-First AI',
    title: 'Your data stays yours.',
    body: 'Your documents are encrypted, never used to train AI models, and remain completely under your control.',
    bullets: [
      'Never used for AI training',
      'End-to-end encrypted',
      '100% private by design',
    ],
    icon: Brain,
  },
  {
    id: 'pathfinder',
    tag: 'PATHFINDER',
    title: 'Know what else you may need.',
    body: 'The Pathfinder connects related documents. An immigration file may need a passport and lease. Insurance may need medical reports and ID proof.',
    bullets: [
      'Related document suggestions',
      'Missing document hints',
      'Useful for immigration, housing, claims, and travel',
    ],
    icon: FileSearch,
  },
  {
    id: 'care',
    tag: 'AI Document Assistant',
    title: 'Ask your vault anything.',
    body: 'Upload documents and let AI instantly find answers, summarize content, and navigate your files—without endless searching.',
    bullets: [
      'AI-powered document search',
      'Instant summaries & insights',
      'Natural language Q&A',
    ],
    icon: HeartHandshake,
  },
  {
    id: 'actions',
    tag: '30-DAY PLAN',
    title: 'Turn every document into next steps.',
    body: 'The app generates practical action items like renew passport, verify lease dates, contact insurer, save provider details, or collect missing papers.',
    bullets: [
      'Renewal and expiry checks',
      'Contact and checklist reminders',
      'Actionable family-ready tasks',
    ],
    icon: CheckCircle2,
  },
  {
    id: 'access',
    tag: 'Anchor AIs',
    title: 'One family. Securely connected.',
    body: 'Share a secure workspace with your partner while keeping personal information private. Manage shared documents together, with individual vaults for each family member.',
    bullets: ['Shared family workspace', 'Private vaults for every member', 'Secure access for trusted contacts'],
    icon: Lock,
  },
]

const USE_CASES = [
  'Immigration process',
  'Disaster recovery',
  'Chronic illness care',
  'Hospitalization',
  'Sudden relocation',
  'Lease and housing proof',
  'Insurance claims',
  'Family emergency',
  'Estate planning',
  'Tax and legal organization',
]

const FAQS = [
  {
    q: 'Is this app only for death or inheritance?',
    a: 'No. Anchor AI is for any situation where important documents need to be understood quickly — immigration, disasters, chronic illness, hospitalization, relocation, insurance claims, caregiving, legal planning, and family emergencies.',
  },
  {
    q: 'How is this different from Google Drive?',
    a: 'Google Drive stores files. Anchor AI explains them, connects related documents, creates action plans, and controls who can see what.',
  },
  {
    q: 'What happens if I upload immigration and lease documents?',
    a: 'You can ask the AI agent questions about your immigration process. It can say which uploaded documents are relevant, whether your lease may help as address proof, and what documents may still be missing.',
  },
  {
    q: 'Can emergency contacts see everything?',
    a: 'No. Emergency contacts only see documents marked Emergency Only. Family members only see documents explicitly shared with family.',
  },
  {
    q: 'Do you train AI models on uploaded documents?',
    a: 'No. The MVP should clearly state that AI responses are generated only from uploaded documents and that documents are not used to train AI models.',
  },
  {
    q: 'What should I upload first?',
    a: 'Start with one high-impact document: passport, insurance policy, lease, immigration document, medical report, loan agreement, or emergency contact document.',
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#F0EBD8] text-[#0D1321]">
      {/* Hero */}
      <section className="px-5 pb-24 pt-36 md:px-8 md:pb-32 md:pt-44">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-[#3E5C76]">
            7 Features
          </p>

          <h1 className="text-6xl font-black leading-[0.92] tracking-[-0.065em] text-[#0D1321] md:text-8xl">
            One vault.
            <br />
            <span className="font-serif text-6xl font-light italic tracking-[-0.04em] text-[#3E5C76] md:text-8xl">
              Life, organized.
            </span>
          </h1>

          <p className="mx-auto mt-12 max-w-4xl text-left text-2xl leading-[1.7] tracking-wide text-[#1D2D44]/80 md:text-[28px]">
            Anchor is an all-in-one digital continuity platform with integrated tools for document storage, financial organization, trusted contacts, emergency preparedness, password management, multimedia memories, and legacy planning. Powered by a unified encrypted vault and shared permission model, Anchor eliminates fragmented information by keeping every critical detail connected in one place. 
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex items-center gap-3 rounded-full bg-[#0D1321] px-8 py-4 text-base font-bold text-[#F0EBD8] transition hover:scale-[1.03] hover:bg-[#1D2D44]"
            >
              Open upload vault
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/signin"
              className="inline-flex items-center gap-3 rounded-full border border-[#0D1321]/20 px-8 py-4 text-base font-bold text-[#0D1321] transition hover:bg-[#748CAB]/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Seven features */}
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-5xl">
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#0D1321] md:text-7xl">
              The six features
              <br />
              <span className="font-serif font-light italic text-[#3E5C76]">
                that make up Anchor AI.
              </span>
            </h2>

            <p className="mt-10 max-w-4xl text-xl leading-9 text-[#1D2D44]/75">
              Each feature works on its own. Together, they create one connected
              system for storing, understanding, sharing, and acting on important
              family documents.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  id={feature.id}
                  key={feature.tag}
                  className="rounded-[2rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#3E5C76]/40 hover:bg-[#748CAB]/15 hover:shadow-xl md:p-10"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#3E5C76]">
                      {feature.tag}
                    </p>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0D1321]/10 bg-[#1D2D44] text-[#F0EBD8]">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <h3 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] text-[#0D1321]">
                    {feature.title}
                  </h3>

                  <p className="mt-7 max-w-2xl text-lg leading-8 text-[#1D2D44]/75">
                    {feature.body}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-base leading-7 text-[#1D2D44]/75"
                      >
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3E5C76]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/upload"
                    className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#0D1321] px-6 py-3 text-sm font-bold text-[#F0EBD8] transition hover:scale-[1.03] hover:bg-[#3E5C76]"
                  >
                    Try this feature
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="how" className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#1D2D44] p-8 text-[#F0EBD8] shadow-2xl md:p-14">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[#748CAB]">
                More than inheritance
              </p>

              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">
                Built for life’s
                <br />
                <span className="font-serif font-light italic text-[#748CAB]">
                  high-pressure moments.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-xl leading-9 text-[#F0EBD8]/70">
                Families often need documents when something is already urgent:
                a hospital visit, visa issue, flood, fire, sudden move, insurance
                claim, or caregiving responsibility. Anchor AI makes those
                documents findable, understandable, and safely shareable.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {USE_CASES.map((useCase) => (
                  <div
                    key={useCase}
                    className="rounded-2xl border border-[#748CAB]/25 bg-[#0D1321]/45 px-5 py-4 text-[#F0EBD8]/80 transition hover:border-[#748CAB]/60 hover:bg-[#3E5C76]/45"
                  >
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-8 shadow-sm md:p-10">
              <ShieldCheck className="mb-10 h-10 w-10 text-[#3E5C76]" />

              <p className="mb-6 font-mono text-sm uppercase tracking-[0.35em] text-[#3E5C76]">
                Privacy
              </p>

              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#0D1321]">
                Your documents
                <br />
                stay yours.
              </h2>

              <p className="mt-8 text-xl leading-9 text-[#1D2D44]/75">
                Privacy should be visible throughout the product — upload,
                dashboard, document view, and chatbot.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-8 shadow-sm md:p-10">
              <div className="space-y-4">
                {[
                  'Your documents are encrypted.',
                  'AI responses are generated only for your uploaded documents.',
                  'We do not use your documents to train AI models.',
                  'Emergency contacts only see Emergency Only documents.',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-[#0D1321]/10 bg-[#748CAB]/20 p-5"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[#1D2D44]" />
                    <p className="text-lg font-semibold text-[#0D1321]/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#0D1321] md:text-7xl">
              Ask the vault.
              <br />
              <span className="font-serif font-light italic text-[#3E5C76]">
                Get answers from your files.
              </span>
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-8 shadow-sm md:p-10">
              <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#3E5C76]">
                User question
              </p>

              <p className="mt-8 text-3xl font-black leading-tight tracking-[-0.04em] text-[#0D1321]">
                “Can my lease help with my immigration process?”
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#1D2D44] p-8 text-[#F0EBD8] shadow-2xl md:p-10">
              <div className="mb-8 flex items-center gap-3">
                <Bot className="h-7 w-7 text-[#748CAB]" />
                <p className="font-bold text-[#F0EBD8]">Anchor AI</p>
              </div>

              <p className="text-xl leading-9 text-[#F0EBD8]/72">
                You uploaded an immigration document and a lease document. Your
                lease may help as address proof if your immigration process
                requires proof of residence. Keep your passport, visa/I-20,
                I-94, and lease copy ready. I used your uploaded immigration and
                lease documents to answer this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-black tracking-[-0.06em] text-[#0D1321] md:text-7xl">
            Frequently asked
          </h2>

          <div className="mt-10 border-t border-[#0D1321]/15">
            {FAQS.map((faq, index) => (
              <details
                key={faq.q}
                className="group border-b border-[#0D1321]/15 py-8"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8">
                  <div className="grid flex-1 grid-cols-[52px_1fr] items-center gap-4">
                    <span className="font-mono text-sm text-[#3E5C76]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3 className="text-xl font-bold text-[#0D1321]/85 md:text-2xl">
                      {faq.q}
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0D1321]/20 text-[#0D1321] transition group-open:rotate-45 group-open:bg-[#1D2D44] group-open:text-[#F0EBD8]">
                    <Plus className="h-5 w-5" />
                  </span>
                </summary>

                <p className="ml-[68px] mt-6 max-w-4xl text-lg leading-8 text-[#1D2D44]/75">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#0D1321] p-8 text-[#F0EBD8] shadow-2xl md:p-14">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[#748CAB]">
                Start with one document
              </p>

              <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">
                Upload one file.
                <br />
                <span className="font-serif font-light italic text-[#748CAB]">
                  Understand what matters.
                </span>
              </h2>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F0EBD8] px-8 py-4 text-base font-bold text-[#0D1321] transition hover:scale-[1.03] hover:bg-[#748CAB]"
            >
              Open upload vault
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}