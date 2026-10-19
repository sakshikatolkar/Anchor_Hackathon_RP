import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getAccessibleOwnerIds } from '@/lib/vault-access'
import OpenAI from 'openai'
import pdfParse from 'pdf-parse'

interface DocumentContent {
  id: string
  fileName: string
  category?: string
  content: string
  buffer?: Buffer
  isImageBased?: boolean
}

type DocumentRow = {
  id: string
  file_name: string | null
  original_filename?: string | null
  filename?: string | null
  category?: string | null
  s3_key?: string | null
  mime_type?: string | null
  plain_english_summary?: string | null
  important_dates_and_deadlines?: unknown
  payments_amounts_balances?: unknown
}

type AuthUser = {
  id: string
  email?: string | null
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('[chat] OPENAI_API_KEY not found in environment')
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  console.log('[chat] Initializing OpenAI client with API key')
  return new OpenAI({
    apiKey: apiKey,
  })
}

async function extractPDFText(buffer: Buffer): Promise<{ text: string; isImageBased: boolean }> {
  try {
    console.log('[chat] Extracting PDF text using pdf-parse')
    const data = await pdfParse(buffer)

    if (data.text && data.text.trim().length > 0) {
      console.log(`[chat] Extracted ${data.text.length} characters from PDF`)
      return { text: data.text, isImageBased: false }
    }

    console.log(`[chat] PDF is image-based or encrypted (${data.numpages} pages, no extractable text)`)
    return { text: '', isImageBased: true }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('[chat] Error parsing PDF:', error)
    return { text: '', isImageBased: true }
  }
}

async function extractFileContent(
  buffer: Buffer,
  fileName: string,
  mimeType?: string | null,
): Promise<{ content: string; isImageBased: boolean }> {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''

  if (ext === 'pdf' || mimeType?.includes('pdf')) {
    const { text, isImageBased } = await extractPDFText(buffer)
    return { content: text, isImageBased }
  }

  if (['txt', 'md', 'csv', 'json'].includes(ext)) {
    return { content: buffer.toString('utf-8'), isImageBased: false }
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return { content: `[Image file: ${fileName}]`, isImageBased: false }
  }

  return { content: `[Binary file: ${fileName}]`, isImageBased: false }
}

async function getUserDocuments(user: AuthUser): Promise<DocumentContent[]> {
  const supabase = await createSupabaseServerClient()
  const ownerIds = await getAccessibleOwnerIds(supabase, user)
  const documentStore = createSupabaseAdminClient() ?? supabase
  const { data, error } = await documentStore
    .from('documents')
    .select('*')
    .in('owner_id', ownerIds)
    .order('uploaded_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('[chat] Error fetching document metadata:', error.message)
    return []
  }

  const rows = (data ?? []).filter((doc): doc is DocumentRow => Boolean(doc.s3_key))

  if (rows.length === 0) {
    console.log(`[chat] No documents found for user ${user.id}`)
    return []
  }

  const s3 = getS3Client()
  const bucket = process.env.AWS_S3_BUCKET!

  console.log(`[chat] Fetching ${rows.length} document(s) for user ${user.id}`)

  try {
    const documents: DocumentContent[] = []

    for (const row of rows) {
      const fileName =
        row.file_name || row.original_filename || row.filename || 'Uploaded document'
      const structuredContext = formatStructuredAnalysis(row)

      if (row.plain_english_summary) {
        documents.push({
          id: row.id,
          fileName,
          category: row.category || undefined,
          content: `${row.plain_english_summary}${structuredContext}`,
        })
        continue
      }

      console.log(`[chat] Reading document from storage: ${fileName}`)

      const getResponse = await s3.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: row.s3_key!,
        }),
      )

      if (!getResponse.Body) continue

      const stream = sdkStreamMixin(getResponse.Body)
      const chunks: Buffer[] = []

      await new Promise<void>((resolve, reject) => {
        stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        stream.on('end', () => resolve())
        stream.on('error', reject)
      })

      const buffer = Buffer.concat(chunks)
      const { content, isImageBased } = await extractFileContent(
        buffer,
        fileName,
        row.mime_type,
      )

      documents.push({
        id: row.id,
        fileName,
        category: row.category || undefined,
        content: `${content}${structuredContext}`,
        buffer: isImageBased ? buffer : undefined,
        isImageBased,
      })
    }

    console.log(`[chat] Retrieved ${documents.length} documents for user ${user.id}`)
    return documents
  } catch (err) {
    console.error('[chat] Error fetching documents:', err)
    return []
  }
}

function formatStructuredAnalysis(row: DocumentRow) {
  const parts: string[] = []

  if (row.important_dates_and_deadlines) {
    parts.push(
      `\nImportant dates/deadlines: ${JSON.stringify(
        row.important_dates_and_deadlines,
      ).slice(0, 1200)}`,
    )
  }

  if (row.payments_amounts_balances) {
    parts.push(
      `\nPayments/amounts/balances: ${JSON.stringify(
        row.payments_amounts_balances,
      ).slice(0, 1200)}`,
    )
  }

  return parts.join('')
}

function selectRelevantDocuments(documents: DocumentContent[], message: string) {
  const normalizedMessage = normalizeDocumentText(message)
  const exactMatches = documents.filter((doc) => {
    const normalizedName = normalizeDocumentText(doc.fileName)

    return normalizedName.length > 0 && normalizedMessage.includes(normalizedName)
  })

  return exactMatches.length > 0 ? exactMatches : documents
}

function normalizeDocumentText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export async function chatWithDocuments(
  user: AuthUser,
  message: string,
): Promise<string> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  console.log(`[chat] User ${user.id} message: ${message}`)

  // Get user's documents
  const documents = await getUserDocuments(user)
  const relevantDocuments = selectRelevantDocuments(documents, message)

  // Separate text-based and image-based documents
  const textDocs = relevantDocuments.filter((d) => !d.isImageBased)
  const imageDocs = relevantDocuments.filter((d) => d.isImageBased && d.buffer)

  // Build context from text documents
  let documentContext = ''
  if (textDocs.length > 0) {
    documentContext = `\n\nUser's uploaded documents:\n\n${textDocs
      .map(
        (doc, idx) =>
          [
            `Document ${idx + 1}: ${doc.fileName}`,
            doc.category ? `Category: ${doc.category}` : '',
            `Open link: /api/documents/link?id=${encodeURIComponent(doc.id)}`,
            '---',
            `${(doc.content || '').substring(0, 2500)}${
              (doc.content || '').length > 2500 ? '\n[... truncated]' : ''
            }`,
            '---',
          ]
            .filter(Boolean)
            .join('\n'),
      )
      .join('\n\n')}`
  }

  if (imageDocs.length > 0) {
    documentContext += `\n\nThe following are scanned/image-based documents that will be analyzed visually: ${imageDocs.map((d) => d.fileName).join(', ')}`
  }

  if (relevantDocuments.length === 0) {
    documentContext =
      documents.length === 0
        ? '\n\nThe user has not uploaded any documents yet.'
        : '\n\nThe user has uploaded documents, but their contents could not be loaded right now.'
  }

  const systemPrompt = `You are Anchor AI, a helpful assistant for a document management vault system.
You help users organize and understand their important documents.

${documentContext}

Your role is to:
- Answer questions about the user's uploaded documents
- Help them understand document categories and organization
- Suggest what documents they might be missing
- Guide them through the vault system
- Only provide information based on their uploaded documents
- Be empathetic and clear in your responses
- Do NOT give legal, medical, or financial advice
- Keep responses concise and helpful
- When asked for a document link, use the provided Open link path for the matching document.
- When asked for a summary, do not dump raw extracted text. Start with a short plain-English overview, then give 3-6 useful bullets.

FORMATTING GUIDELINES:
- Use short section headers only when helpful
- Use bullet points (•) for lists and key details
- Use bold text (**text**) for important terms and values
- Keep information scannable and easy to read
- Use numbered lists (1. 2. 3.) for sequential steps or rankings
- Group related information together
- Highlight key numbers and dates with bold formatting
- Avoid raw markdown clutter and avoid trailing ### markers`

  console.log(`[chat] Context prepared with ${relevantDocuments.length} documents (${imageDocs.length} image-based)`)

  try {
    // If there are image-based PDFs, upload them via Files API and use Responses API
    if (imageDocs.length > 0) {
      console.log(`[chat] Using Responses API for ${imageDocs.length} scanned document(s)`)

      const inputItems: OpenAI.Responses.ResponseInputItem[] = [
        { type: 'message', role: 'user', content: [{ type: 'input_text', text: message }] },
      ]

      const uploadedFileIds: string[] = []

      for (const doc of imageDocs) {
        if (!doc.buffer) continue
        console.log(`[chat] Uploading scanned PDF to OpenAI: ${doc.fileName}`)

        const blob = new Blob([doc.buffer], { type: 'application/pdf' })
        const file = new File([blob], doc.fileName, { type: 'application/pdf' })

        const uploaded = await client.files.create({ file, purpose: 'assistants' })
        uploadedFileIds.push(uploaded.id)

        inputItems.push({
          type: 'message',
          role: 'user',
          content: [
            { type: 'input_text', text: `Scanned document: ${doc.fileName}` },
            { type: 'input_file', file_id: uploaded.id },
          ],
        } as OpenAI.Responses.ResponseInputItem)
      }

      try {
        const response = await client.responses.create({
          model: 'gpt-4o',
          instructions: systemPrompt,
          input: inputItems,
          max_output_tokens: 1024,
        })

        const textContent = response.output_text
        if (textContent) {
          console.log('[chat] Responses API vision response generated successfully')
          // Clean up uploaded files
          for (const fileId of uploadedFileIds) {
            client.files.del(fileId).catch(() => {})
          }
          return textContent
        }
      } catch (visionErr) {
        console.error('[chat] Responses API failed, falling back to standard chat:', visionErr)
        // Clean up and fall through to standard chat
        for (const fileId of uploadedFileIds) {
          client.files.del(fileId).catch(() => {})
        }
      }
    }

    // Standard text-only request
    const response = await client.chat.completions.create({
      model,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    })

    const textContent = response.choices[0]?.message?.content
    if (textContent) {
      console.log('[chat] Response generated successfully')
      return textContent
    }

    return 'I could not generate a response. Please try again.'
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('[chat] Error calling OpenAI API:', error)
    throw new Error(`Failed to generate response: ${error}`)
  }
}
