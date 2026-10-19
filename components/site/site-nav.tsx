'use client'

import { cn } from '@/lib/utils'
import { Menu, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/upload', label: 'Upload' },
  { href: '/features#security', label: 'Security' },
  { href: '/features#how', label: 'How It Works' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f3f1ee]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-black">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-black">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span className="text-lg font-medium tracking-tight">
            Anchor
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-[15px] font-medium text-black/70 transition hover:text-black',
                pathname === l.href && 'text-black',
              )}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/login"
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-black md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/10 bg-[#f3f1ee] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-black/70 hover:bg-black hover:text-white"
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="mt-2 rounded-full border border-black/15 px-5 py-3 text-center text-base font-semibold text-black"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}