import {
  decodeInviteCookie,
  encodeInviteCookie,
  INVITE_COOKIE,
  verifyInviteToken,
} from '@/lib/share-invites'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type SupabaseWriteClient =
  | NonNullable<ReturnType<typeof createSupabaseAdminClient>>
  | Awaited<ReturnType<typeof createSupabaseServerClient>>

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const invite = token ? verifyInviteToken(token) : null

  if (!token || !invite) {
    return NextResponse.redirect(new URL('/share', request.nextUrl.origin))
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const next = `/api/share/accept?token=${encodeURIComponent(token)}`
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, request.nextUrl.origin),
    )
  }

  if (user.email) {
    const accessStore = createSupabaseAdminClient() ?? supabase

    try {
      await ensureUserRow(accessStore, user)
      await acceptInvite(accessStore, invite.ownerId, user.email, invite.role)
    } catch (error) {
      console.error('[share.accept]', error)
    }
  }

  const cookieStore = await cookies()
  const existingTokens = decodeInviteCookie(cookieStore.get(INVITE_COOKIE)?.value)
  const response = NextResponse.redirect(
    new URL('/upload?shared=accepted', request.nextUrl.origin),
  )

  response.cookies.set(INVITE_COOKIE, encodeInviteCookie([...existingTokens, token]), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.max(0, invite.exp - Math.floor(Date.now() / 1000)),
  })

  return response
}

async function ensureUserRow(
  supabase: SupabaseWriteClient,
  user: User,
) {
  const { data } = await supabase.from('users').select('id').eq('id', user.id).single()

  if (data) return

  await supabase.from('users').insert({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
    password_hash: 'oauth',
  })
}

async function acceptInvite(
  supabase: SupabaseWriteClient,
  ownerId: string,
  email: string,
  role: 'Family' | 'Emergency',
) {
  const normalizedEmail = email.toLowerCase()
  const { data } = await supabase
    .from('access_control')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('grantee_email', normalizedEmail)
    .single()

  if (data) return

  await supabase.from('access_control').insert({
    owner_id: ownerId,
    grantee_email: normalizedEmail,
    role,
  })
}
