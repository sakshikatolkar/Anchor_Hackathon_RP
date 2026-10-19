import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getAccessibleOwnerIds } from '@/lib/vault-access'
import { NextRequest, NextResponse } from 'next/server'

const LINK_TTL_SECONDS = 5 * 60

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

  const documentId = request.nextUrl.searchParams.get('id')
  const ownerIds = await getAccessibleOwnerIds(supabase, user)
  const documentStore = createSupabaseAdminClient() ?? supabase

  if (!documentId) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 })
  }

  const { data: document, error } = await documentStore
    .from('documents')
    .select('s3_key,file_name,mime_type,owner_id')
    .eq('id', documentId)
    .in('owner_id', ownerIds)
    .single()

  if (error || !document?.s3_key) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: document.s3_key,
      ResponseContentDisposition: `inline; filename="${safeFilename(
        document.file_name,
      )}"`,
      ResponseContentType: document.mime_type || undefined,
    }),
    { expiresIn: LINK_TTL_SECONDS },
  )

  return NextResponse.redirect(url, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  })
}

function safeFilename(value: string | null) {
  return (value || 'document').replace(/["\r\n]/g, '')
}
