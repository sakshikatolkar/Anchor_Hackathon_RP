import { verifyInviteToken } from '@/lib/share-invites'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

type SharePageProps = {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const { token } = await searchParams
  const invite = token ? verifyInviteToken(token) : null

  if (!token || !invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0EBD8] px-5 text-[#0D1321]">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-black">This invite is invalid</h1>
          <p className="mt-3 text-sm leading-6 text-[#3E5C76]">
            Ask the vault owner to generate a new sharing link.
          </p>
        </div>
      </main>
    )
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/share?token=${token}`)}`)
  }

  redirect(`/api/share/accept?token=${encodeURIComponent(token)}`)
}
