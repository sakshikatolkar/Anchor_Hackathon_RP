import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024
const CATEGORIES = new Set([
  'Identity',
  'Immigration',
  'Housing',
  'Insurance',
  'Medical',
  'Financial',
  'Legal',
  'Other',
])
const VISIBILITIES = new Set(['Private', 'Family', 'Emergency'])
const ALLOWED_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'])
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/octet-stream',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET!

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure a row exists in public.users (Google OAuth only creates auth.users)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        password_hash: 'oauth',
      })
    }

    const form = await request.formData()
    const file = form.get('file') as File | null
    const requestedCategory = (form.get('category') as string) || 'Other'
    const requestedVisibility = (form.get('visibility') as string) || 'Private'
    const category = CATEGORIES.has(requestedCategory) ? requestedCategory : 'Other'
    const visibility = VISIBILITIES.has(requestedVisibility)
      ? requestedVisibility
      : 'Private'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum upload size is 20 MB.' },
        { status: 400 },
      )
    }

    const ext = getExtension(file.name)

    if (
      !ALLOWED_EXTENSIONS.has(ext) ||
      (file.type && !ALLOWED_MIME_TYPES.has(file.type))
    ) {
      return NextResponse.json(
        { error: 'Unsupported file type. Upload a PDF, JPG, PNG, DOC, or DOCX.' },
        { status: 400 },
      )
    }

    const safeOriginalName = sanitizeFilename(file.name)
    const storedFilename = `${randomUUID()}.${ext}`
    const s3Key = `${user.id}/${storedFilename}`

    const buffer = Buffer.from(await file.arrayBuffer())

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
        Metadata: {
          owner_id: user.id,
          original_filename: safeOriginalName,
        },
      }),
    )

    const region = process.env.AWS_REGION ?? 'us-east-1'
    const s3Url = `s3://${BUCKET}/${s3Key}`

    const { data: doc, error } = await supabase
      .from('documents')
      .insert({
        owner_id: user.id,
        filename: storedFilename,
        original_filename: safeOriginalName,
        file_type: ext,
        file_name: safeOriginalName,
        s3_key: s3Key,
        s3_url: s3Url,
        category,
        visibility,
        size: formatSize(file.size),
        mime_type: file.type,
        status: 'ready',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ doc })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || ''
}

function sanitizeFilename(filename: string) {
  return filename
    .replace(/[^\w.\- ()]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'document'
}
