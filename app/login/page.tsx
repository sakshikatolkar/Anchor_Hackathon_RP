'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Lock,
  ShieldCheck,
  Users,
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

const ROLES = [
  {
    title: 'Owner',
    href: '/upload?role=Owner',
    description: 'Full vault access.',
    icon: ShieldCheck,
    badge: 'Full access',
  },
  {
    title: 'Family Member',
    href: '/upload?role=Family',
    description: 'Only shared documents.',
    icon: Users,
    badge: 'Shared access',
  },
  {
    title: 'Emergency Contact',
    href: '/upload?role=Emergency',
    description: 'Only emergency documents.',
    icon: AlertTriangle,
    badge: 'Emergency access',
  },
]

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const next = new URLSearchParams(window.location.search).get('next')
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    callbackUrl.searchParams.set('next', next || '/upload?role=Owner')

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl.toString() },
    })
  }

  return (
    <main className="min-h-screen bg-[#0D1321] text-[#F0EBD8]">
      <section className="relative overflow-hidden px-5 py-12 md:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(116,140,171,0.18),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(62,92,118,0.22),transparent_30%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            {/* Left content */}
            <div>
              <Link
                href="/"
                className="mb-12 inline-flex items-center gap-3 text-[#F0EBD8]/70 transition hover:text-[#F0EBD8]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EBD8] text-[#0D1321]">
                  <Lock className="h-5 w-5" />
                </span>
                <span className="font-semibold">Anchor AI</span>
              </Link>

              <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[#748CAB]">
                Demo Login
              </p>

              <h1 className="max-w-3xl text-6xl font-black leading-[0.92] tracking-[-0.065em] md:text-8xl">
                Choose your
                <br />
                <span className="font-serif font-light italic text-[#748CAB]">
                  vault role.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-xl leading-9 text-[#F0EBD8]/65">
                Pick how you want to enter the demo. Each role shows a different
                level of document access.
              </p>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {['Private access', 'Shared access', 'Emergency access'].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 p-4"
                    >
                      <Lock className="mb-3 h-5 w-5 text-[#748CAB]" />
                      <p className="text-sm leading-5 text-[#F0EBD8]/70">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Role card */}
            <div className="rounded-[2.5rem] border border-[#F0EBD8]/10 bg-[#1D2D44] p-6 shadow-2xl md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[#F0EBD8]">
                  Select access
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#F0EBD8]/55">
                  MVP demo mode. No password required.
                </p>
              </div>

              <div className="space-y-4">
                {ROLES.map((role) => {
                  const Icon = role.icon

                  return (
                    <Link
                      key={role.title}
                      href={role.href}
                      className="group flex items-center justify-between gap-5 rounded-[2rem] border border-[#F0EBD8]/10 bg-[#0D1321] p-5 transition hover:-translate-y-1 hover:border-[#748CAB]/60 hover:bg-[#3E5C76]/45"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#748CAB] text-[#0D1321]">
                          <Icon className="h-7 w-7" />
                        </span>

                        <div>
                          <div className="mb-2 inline-flex rounded-full border border-[#748CAB]/30 px-3 py-1 text-xs font-semibold text-[#748CAB]">
                            {role.badge}
                          </div>

                          <h3 className="text-2xl font-black text-[#F0EBD8]">
                            {role.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#F0EBD8]/60">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-[#748CAB] transition group-hover:translate-x-1 group-hover:text-[#F0EBD8]" />
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 rounded-[2rem] border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 p-5 space-y-4">
                <p className="text-sm leading-6 text-[#F0EBD8]/55">
                  Want to sign in with your account?
                </p>

                <button
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0D1321] transition hover:bg-gray-100"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#748CAB] hover:text-[#F0EBD8]"
                >
                  Email sign in
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
