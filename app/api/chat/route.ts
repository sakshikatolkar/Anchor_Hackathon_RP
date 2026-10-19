import { chatWithDocuments } from '@/lib/chat-with-documents'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getAccessibleOwnerIds } from '@/lib/vault-access'
import { NextRequest, NextResponse } from 'next/server'

type DocumentRow = {
  id: string
  file_name: string | null
  original_filename?: string | null
  filename?: string | null
  category: string | null
  plain_english_summary?: string | null
}

type ChatHistoryMessage = {
  role: 'agent' | 'user'
  text: string
}

type AuthUser = {
  id: string
  email?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, history } = await request.json()

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log(`[chat-api] Processing message from user ${user.id}`)

    const linkReply = await maybeCreateDocumentLinkReply(
      user,
      message.trim(),
      sanitizeHistory(history),
    )

    if (linkReply) {
      return NextResponse.json({ reply: linkReply })
    }

    const reply = await chatWithDocuments(user, message.trim())

    return NextResponse.json({ reply })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[chat-api] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function maybeCreateDocumentLinkReply(
  user: AuthUser,
  message: string,
  history: ChatHistoryMessage[],
) {
  if (!isDocumentLinkRequest(message)) return null

  const supabase = await createSupabaseServerClient()
  const ownerIds = await getAccessibleOwnerIds(supabase, user)
  const documentStore = createSupabaseAdminClient() ?? supabase
  const { data, error } = await documentStore
    .from('documents')
    .select('*')
    .in('owner_id', ownerIds)
    .order('uploaded_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const docs = data ?? []

  if (docs.length === 0) {
    return 'I could not find any uploaded documents in your vault yet.'
  }

  const matches = rankDocumentsForMessage(docs, message, history).slice(0, 3)

  if (matches.length === 0) {
    return [
      'I could not confidently tell which document you meant.',
      '',
      'Here are your most recent documents:',
      '',
      ...docs.slice(0, 5).map(
        (doc) =>
          `- [${getDocumentName(doc)}](/api/documents/link?id=${encodeURIComponent(
            doc.id,
          )})${doc.category ? ` (${doc.category})` : ''}`,
      ),
      '',
      'Try asking with a filename or category, like "Give me the link to Sakshi_Katolkar.pdf."',
    ].join('\n')
  }

  const intro =
    matches.length === 1
      ? 'Here is the document link I found:'
      : 'I found a few matching document links:'

  return [
    intro,
    '',
    ...matches.map(
      (doc) =>
        `- [${getDocumentName(doc)}](/api/documents/link?id=${encodeURIComponent(
          doc.id,
        )})${doc.category ? ` (${doc.category})` : ''}`,
    ),
    '',
    'These links require you to be signed in to this vault.',
  ].join('\n')
}

function isDocumentLinkRequest(message: string) {
  const text = message.toLowerCase()
  return /\b(link|url|open|view|download|show me|access)\b/.test(text)
}

function rankDocumentsForMessage(
  docs: DocumentRow[],
  message: string,
  history: ChatHistoryMessage[],
) {
  const currentText = message.toLowerCase()
  const exactMatches = findExactDocumentMatches(docs, currentText)

  if (exactMatches.length > 0) {
    return exactMatches
  }

  const currentTokens = tokenizeDocumentQuery(currentText)
  const currentMatches = scoreDocuments(docs, currentText, currentTokens, '')

  if (currentMatches.length > 0) {
    return currentMatches
  }

  const historyText = history
    .map((item) => item.text)
    .join(' ')
    .toLowerCase()
    .slice(-6000)
  const combinedText = `${currentText} ${historyText}`
  const tokens = tokenizeDocumentQuery(combinedText)

  return scoreDocuments(docs, currentText, tokens, historyText)
}

function scoreDocuments(
  docs: DocumentRow[],
  currentText: string,
  tokens: string[],
  historyText: string,
) {
  return docs
    .map((doc) => {
      const name = getDocumentName(doc).toLowerCase()
      const category = (doc.category || '').toLowerCase()
      const summary = (doc.plain_english_summary || '').toLowerCase()
      const haystack = `${name} ${category} ${summary}`
      let score = 0

      if (category && currentText.includes(category)) score += 12
      if (name && currentText.includes(name)) score += 20
      if (name && historyText.includes(name)) score += 14

      if (currentText.includes('resume') || currentText.includes('cv')) {
        if (/\b(resume|cv|education|experience|skills|linkedin|github|projects)\b/.test(haystack)) {
          score += 10
        }
      }

      for (const token of tokens) {
        if (name.includes(token)) score += currentText.includes(token) ? 5 : 2
        if (category.includes(token)) score += currentText.includes(token) ? 6 : 2
        if (summary.includes(token)) score += currentText.includes(token) ? 3 : 1
      }

      return { doc, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc)
}

function tokenizeDocumentQuery(value: string) {
  return value
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
}

function findExactDocumentMatches(docs: DocumentRow[], text: string) {
  const normalizedText = normalizeDocumentText(text)

  return docs.filter((doc) => {
    const name = normalizeDocumentText(getDocumentName(doc))

    return name.length > 0 && normalizedText.includes(name)
  })
}

function normalizeDocumentText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getDocumentName(doc: DocumentRow) {
  return doc.file_name || doc.original_filename || doc.filename || 'Document'
}

function sanitizeHistory(value: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(value)) return []

  return value
    .slice(-8)
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const role = 'role' in item ? item.role : undefined
      const text = 'text' in item ? item.text : undefined

      if ((role !== 'agent' && role !== 'user') || typeof text !== 'string') {
        return null
      }

      return { role, text: text.slice(0, 2000) }
    })
    .filter((item): item is ChatHistoryMessage => item !== null)
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'give',
  'link',
  'url',
  'open',
  'view',
  'download',
  'show',
  'summary',
  'document',
  'file',
  'pdf',
  'my',
])
