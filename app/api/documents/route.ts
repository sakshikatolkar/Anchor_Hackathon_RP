import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getAccessibleOwnerIds, isOwnedByUser } from '@/lib/vault-access'
import { NextRequest, NextResponse } from 'next/server'

const VISIBILITIES = new Set(['Private', 'Family', 'Emergency'])

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const ownerIds = await getAccessibleOwnerIds(supabase, user)
  const adminStore = createSupabaseAdminClient()

  if (ownerIds.some((ownerId) => ownerId !== user.id) && !adminStore) {
    return NextResponse.json(
      {
        error:
          'Shared vault access is not configured on the server. Add SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy.',
      },
      { status: 500 },
    )
  }

  const documentStore = adminStore ?? supabase

  let query = documentStore
    .from('documents')
    .select('*')
    .in('owner_id', ownerIds)
    .order('uploaded_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const docs = (data ?? []).map((doc) => sanitizeDocumentRow(doc, user.id))

  return NextResponse.json({ docs })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 })
  }

  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('s3_key')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (fetchError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (document.s3_key) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: document.s3_key,
        }),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Storage delete failed'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, visibility } = await request.json()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 })
  }

  if (!VISIBILITIES.has(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('documents')
    .update({ visibility })
    .eq('id', id)
    .eq('owner_id', user.id)
    .select('id,visibility')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ doc: data })
}

function sanitizeDocumentRow(row: Record<string, unknown>, userId: string) {
  const { s3_key: _s3Key, s3_url: _s3Url, owner_id: _ownerId, ...safeRow } = row

  return {
    ...safeRow,
    can_delete: isOwnedByUser(row, userId),
    is_shared: !isOwnedByUser(row, userId),
    view_url: `/api/documents/link?id=${encodeURIComponent(String(row.id))}`,
  }
}
