import {
  decodeInviteCookie,
  INVITE_COOKIE,
  verifyInviteToken,
} from '@/lib/share-invites'
import { cookies } from 'next/headers'

type SupabaseClientLike = {
  from: (table: string) => any
}

type UserLike = {
  id: string
  email?: string | null
}

export async function getAccessibleOwnerIds(
  supabase: SupabaseClientLike,
  user: UserLike,
) {
  const ownerIds = new Set([user.id])
  const cookieStore = await cookies()
  const inviteTokens = decodeInviteCookie(cookieStore.get(INVITE_COOKIE)?.value)

  for (const token of inviteTokens) {
    const invite = verifyInviteToken(token)
    if (invite) ownerIds.add(invite.ownerId)
  }

  if (!user.email) return [...ownerIds]

  const { data, error } = await supabase
    .from('access_control')
    .select('owner_id')
    .eq('grantee_email', user.email.toLowerCase())

  if (error) {
    console.error('[vault-access]', error.message)
    return [...ownerIds]
  }

  for (const row of data ?? []) {
    if (row.owner_id) ownerIds.add(String(row.owner_id))
  }

  return [...ownerIds]
}

export function isOwnedByUser(row: Record<string, unknown>, userId: string) {
  return row.owner_id === userId
}
