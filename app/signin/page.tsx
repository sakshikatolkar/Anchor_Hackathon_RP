'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Eye,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function SignInPage() {
  const handleGoogleSignIn = async () => {
    const next = new URLSearchParams(window.location.search).get('next')
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    callbackUrl.searchParams.set('next', next || '/upload?role=Owner')

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })
  }
  return (
    <main className="min-h-screen bg-[var(--vault-night)] text-[var(--vault-cream)]">
      <section className="relative overflow-hidden px-5 py-12 md:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(116,140,171,0.2),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(62,92,118,0.24),transparent_30%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            {/* Left content */}
            <div>
              <Link
                href="/"
                className="mb-12 inline-flex items-center gap-3 text-[var(--vault-cream)]/70 transition hover:text-[var(--vault-cream)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--vault-cream)] text-[var(--vault-night)]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="font-semibold">Anchor AI</span>
              </Link>

              <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[var(--vault-blue)]">
                Secure Sign In
              </p>

              <h1 className="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.065em] md:text-8xl">
                Welcome back
                <br />
                <span className="font-serif font-light italic text-[var(--vault-blue)]">
                  to your vault.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-xl leading-9 text-[var(--vault-cream)]/65">
                Sign in to access your documents, AI summaries, action plans,
                Pathfinder suggestions, and role-based sharing settings.
              </p>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  'Encrypted documents',
                  'Private AI answers',
                  'Role-based access',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--vault-cream)]/10 bg-[var(--vault-cream)]/5 p-4"
                  >
                    <Lock className="mb-3 h-5 w-5 text-[var(--vault-blue)]" />
                    <p className="text-sm leading-5 text-[var(--vault-cream)]/70">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-[2.5rem] border border-[var(--vault-cream)]/10 bg-[var(--vault-navy)] p-6 shadow-2xl md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-[-0.04em]">
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--vault-cream)]/55">
                  MVP demo mode. Use any email and continue to the vault.
                </p>
              </div>

              {/* Google OAuth */}
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--vault-cream)]/15 bg-white px-5 py-4 font-semibold text-[#0D1321] transition hover:bg-gray-100"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--vault-cream)]/10" />
                <span className="text-xs text-[var(--vault-cream)]/40">or sign in with email</span>
                <div className="h-px flex-1 bg-[var(--vault-cream)]/10" />
              </div>

              <form className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--vault-cream)]/80">
                    Email address
                  </span>

                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--vault-cream)]/10 bg-[var(--vault-night)] px-4 py-4">
                    <Mail className="h-5 w-5 text-[var(--vault-blue)]" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-[var(--vault-cream)] outline-none placeholder:text-[var(--vault-cream)]/35"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--vault-cream)]/80">
                    Password
                  </span>

                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--vault-cream)]/10 bg-[var(--vault-night)] px-4 py-4">
                    <Lock className="h-5 w-5 text-[var(--vault-blue)]" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-[var(--vault-cream)] outline-none placeholder:text-[var(--vault-cream)]/35"
                    />
                    <Eye className="h-5 w-5 text-[var(--vault-cream)]/35" />
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[var(--vault-cream)]/60">
                    <input type="checkbox" className="accent-[var(--vault-blue)]" />
                    Remember me
                  </label>

                  <Link
                    href="/login"
                    className="font-semibold text-[var(--vault-blue)] hover:text-[var(--vault-cream)]"
                  >
                    Use demo roles
                  </Link>
                </div>

                <Link
                  href="/upload?role=Owner"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--vault-cream)] px-5 py-4 font-bold text-[var(--vault-night)] transition hover:scale-[1.01] hover:bg-[var(--vault-blue)]"
                >
                  Continue to vault
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </form>

              <div className="mt-6 rounded-2xl border border-[var(--vault-cream)]/10 bg-[var(--vault-cream)]/5 p-4">
                <p className="text-sm leading-6 text-[var(--vault-cream)]/55">
                  New here? For the hackathon demo, you can enter as Owner,
                  Family Member, or Emergency Contact.
                </p>

                <Link
                  href="/login"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--vault-blue)] hover:text-[var(--vault-cream)]"
                >
                  Choose demo access
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
