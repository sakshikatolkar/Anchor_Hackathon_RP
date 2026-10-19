import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const [userRow, docs, accessControl] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('documents').select('*').eq('owner_id', user.id).order('uploaded_at', { ascending: false }),
    supabase.from('access_control').select('*').eq('owner_id', user.id),
  ])

  return NextResponse.json({
    auth_user: { id: user.id, email: user.email },
    public_users_row: userRow.data,
    public_users_error: userRow.error?.message,
    documents: docs.data,
    documents_error: docs.error?.message,
    access_control: accessControl.data,
    access_control_error: accessControl.error?.message,
  })
}
