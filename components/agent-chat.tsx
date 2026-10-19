'use client'

import { type ReactNode, useMemo, useRef, useState } from 'react'
import {
  Bot,
  FileText,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

type AgentChatProps = {
  context?: 'features' | 'upload'
}

type ChatMessage = {
  role: 'agent' | 'user'
  text: string
}

const STARTERS = {
  features: [
    'What does Anchor AI do?',
    'How does emergency access work?',
    'What documents should I upload first?',
  ],
  upload: [
    'Which category should I choose?',
    'What documents am I missing?',
    'How does vault health work?',
  ],
}

function getMockReply(message: string, context: 'features' | 'upload') {
  const text = message.toLowerCase()

  if (text.includes('category') || text.includes('where')) {
    return 'Choose the category that best matches the document. If you are not sure, choose Other. You can update it later.'
  }

  if (text.includes('missing') || text.includes('health')) {
    return 'Vault Health is based on high-priority documents like ID, insurance, medical records, housing proof, immigration files, financial records, legal documents, and emergency instructions.'
  }

  if (text.includes('emergency')) {
    return 'Emergency access is for documents someone may need during urgent moments, like insurance, medical reports, IDs, or emergency instructions.'
  }

  if (text.includes('privacy') || text.includes('secure')) {
    return 'Your documents are treated as private. AI answers should only use your uploaded documents, and your files should not be used to train AI models.'
  }

  if (text.includes('upload')) {
    return 'Start by choosing a category, then upload your document. Once uploaded, Anchor AI can summarize it, suggest next steps, and show related documents.'
  }

  if (context === 'features') {
    return 'Anchor AI helps families organize important documents and understand what to do with them during immigration, illness, emergencies, housing, insurance, legal, and financial situations.'
  }

  return 'I can help you decide where to upload a document, explain Vault Health, suggest missing documents, or guide you through your uploaded files.'
}

function renderMessageText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block, blockIndex) => (
      <div key={blockIndex} className={blockIndex > 0 ? 'mt-3' : undefined}>
        {renderBlock(block)}
      </div>
    ))
}

function renderBlock(block: string) {
  const lines = block.split('\n').filter((line) => line.trim())

  if (lines.length > 1 && lines.every((line) => /^[-*•]\s+/.test(line.trim()))) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {lines.map((line, index) => (
          <li key={index}>{renderInline(line.replace(/^[-*•]\s+/, ''))}</li>
        ))}
      </ul>
    )
  }

  return lines.map((line, index) => {
    const cleaned = line.trim()
    const heading = cleaned.match(/^#{1,4}\s*(.*?)\s*#*$/)
    const bullet = cleaned.match(/^[-*•]\s+(.*)$/)

    if (heading) {
      return (
        <p key={index} className={index > 0 ? 'mt-2 font-black' : 'font-black'}>
          {renderInline(heading[1])}
        </p>
      )
    }

    if (bullet) {
      return (
        <p key={index} className={index > 0 ? 'mt-1 pl-3' : 'pl-3'}>
          <span className="mr-2">•</span>
          {renderInline(bullet[1])}
        </p>
      )
    }

    return (
      <p key={index} className={index > 0 ? 'mt-2' : undefined}>
        {renderInline(cleaned)}
      </p>
    )
  })
}

function renderInline(text: string) {
  const parts: ReactNode[] = []
  const inlinePattern =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|\*\*([^*]+)\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = inlinePattern.exec(text))) {
    const [raw, , label, href, boldText] = match

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (href) {
      parts.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          target={href.startsWith('/') ? undefined : '_blank'}
          rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
          className="font-bold underline underline-offset-2"
        >
          {label}
        </a>,
      )
    } else {
      parts.push(
        <strong key={`${boldText}-${match.index}`} className="font-black">
          {boldText}
        </strong>,
      )
    }

    lastIndex = match.index + raw.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function AgentChat({ context = 'upload' }: AgentChatProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'agent',
      text:
        context === 'features'
          ? 'Hi, I’m your Anchor AI guide. I can explain how the vault works and what documents matter most.'
          : 'Hi, I’m your Anchor AI assistant. I can help you choose categories, understand Vault Health, and organize documents.',
    },
  ])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const starters = useMemo(() => STARTERS[context], [context])

  function sendMessage(value?: string) {
    const message = (value || input).trim()

    if (!message || loading) return

    setMessages((current) => [
      ...current,
      { role: 'user', text: message },
    ])

    setInput('')
    setLoading(true)

    const history = messages.slice(-8)

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to get response')
        }
        return response.json()
      })
      .then(({ reply }) => {
        setMessages((current) => [
          ...current,
          { role: 'agent', text: reply },
        ])
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        console.error('Chat error:', errorMessage)
        
        setMessages((current) => [
          ...current,
          { role: 'agent', text: `Sorry, I encountered an error: ${errorMessage}. Please try again.` },
        ])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#0D1321] px-5 py-4 text-sm font-black text-[#F0EBD8] shadow-2xl shadow-[#0D1321]/25 transition hover:-translate-y-1 hover:bg-[#1D2D44]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#748CAB] text-[#0D1321]">
            <MessageCircle className="h-5 w-5" />
          </span>
          Ask Anchor AI
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] max-w-[430px] overflow-hidden rounded-[2rem] border border-[#F0EBD8]/20 bg-[#0D1321] shadow-2xl shadow-[#0D1321]/35">
          <div className="flex items-center justify-between border-b border-[#F0EBD8]/10 bg-[#1D2D44] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0EBD8] text-[#0D1321]">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <p className="font-black text-[#F0EBD8]">Anchor AI Agent</p>
                <p className="text-xs text-[#748CAB]">
                  Document-aware
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#F0EBD8]/70 transition hover:bg-[#F0EBD8]/10 hover:text-[#F0EBD8]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[440px] space-y-4 overflow-y-auto bg-[#0D1321] p-5">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 p-3">
                <ShieldCheck className="mb-2 h-4 w-4 text-[#748CAB]" />
                <p className="text-xs font-semibold text-[#F0EBD8]/75">
                  Private
                </p>
              </div>

              <div className="rounded-2xl border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 p-3">
                <FileText className="mb-2 h-4 w-4 text-[#748CAB]" />
                <p className="text-xs font-semibold text-[#F0EBD8]/75">
                  Document-aware
                </p>
              </div>

              <div className="rounded-2xl border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 p-3">
                <Sparkles className="mb-2 h-4 w-4 text-[#748CAB]" />
                <p className="text-xs font-semibold text-[#F0EBD8]/75">
                  Guided
                </p>
              </div>
            </div>

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[#748CAB] text-[#0D1321]'
                      : 'bg-[#F0EBD8] text-[#1D2D44]'
                  }`}
                >
                  {renderMessageText(message.text)}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              {starters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="rounded-full border border-[#F0EBD8]/10 bg-[#F0EBD8]/5 px-3 py-2 text-xs font-semibold text-[#F0EBD8]/75 transition hover:bg-[#F0EBD8]/10 hover:text-[#F0EBD8]"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#F0EBD8]/10 bg-[#1D2D44] p-4">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
              className="flex items-center gap-2 rounded-full bg-[#0D1321] px-4 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={loading}
                placeholder="Ask about documents, access, or next steps..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#F0EBD8] outline-none placeholder:text-[#748CAB] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EBD8] text-[#0D1321] transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
