import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Upload Vault', href: '/upload' },
      { label: 'AI Assistant', href: '/upload' },
      { label: 'Sign in', href: '/signin' },
    ],
  },
  {
    title: 'Core features',
    links: [
      { label: 'Secure Upload', href: '/features#upload' },
      { label: 'AI Summary', href: '/features#summary' },
      { label: 'Pathfinder', href: '/features#pathfinder' },
      { label: 'Access Control', href: '/features#access' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Privacy', href: '/features#security' },
      { label: 'Role Access', href: '/features#access' },
      { label: 'Document AI', href: '/features#ai' },
      { label: 'How it works', href: '/features#how' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-[var(--vault-night)] text-[var(--vault-cream)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vault-cream)] text-[var(--vault-night)]">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--vault-cream)]">
                Anchor AI
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--vault-cream)]/60">
              An AI-powered secure document vault that helps families understand,
              organize, and safely share important life documents.
            </p>

            <div className="mt-6 space-y-2 text-sm text-[var(--vault-blue)]">
              <p>Your documents are encrypted.</p>
              <p>AI responses are generated only from your uploads.</p>
              <p>We do not use your documents to train AI models.</p>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--vault-blue)]">
                {col.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--vault-cream)]/75 transition-colors hover:text-[var(--vault-blue)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--vault-cream)]/10 pt-8 text-sm text-[var(--vault-cream)]/45 md:flex-row md:items-center md:justify-between">
          <p>{`\u00A9 ${new Date().getFullYear()} Anchor. Hackathon MVP.`}</p>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--vault-blue)]">
            Encrypted · Private · AI-powered
          </p>
        </div>
      </div>
    </footer>
  )
}