import { createInviteToken } from '@/lib/share-invites'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const ROLES = new Set(['Family', 'Emergency'])

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const role = ROLES.has(body.role) ? body.role : 'Family'
  const token = createInviteToken(user.id, role)
  const url = new URL('/share', request.nextUrl.origin)
  url.searchParams.set('token', token)

  return NextResponse.json({ url: url.toString() })
}
