"use client"

import { useState } from "react"
import { Sparkles, ArrowUp, FileText } from "lucide-react"
import { documents } from "@/lib/mock-data"

type Answer = {
  text: string
  citations: { id: string; title: string }[]
}

const SUGGESTED = [
  "Did Dad have life insurance?",
  "What bills are due soon?",
  "Who gets the house?",
]

function findDoc(id: string) {
  return documents.find((d) => d.id === id)
}

/** Lightweight keyword "RAG" over the mock documents for the demo. */
function answerQuestion(q: string): Answer {
  const text = q.toLowerCase()

  if (text.includes("insurance") || text.includes("life")) {
    return {
      text: "Yes. There's a $500,000 term life policy with MetLife, and Sarah is the sole named beneficiary. To start a claim, call 1-800-638-5433 and reference policy ML-4471-209-83.",
      citations: [{ id: "life-insurance", title: "Term Life Insurance Policy" }],
    }
  }
  if (text.includes("bill") || text.includes("due") || text.includes("pay")) {
    return {
      text: "The mortgage payment of $1,640 is due in 4 days (Wells Fargo, account WF-008-552-1190). Auto insurance with Geico renews in 12 days. Everything else is current.",
      citations: [
        { id: "mortgage", title: "Home Mortgage Statement" },
        { id: "auto-insurance", title: "Auto Insurance Policy" },
      ],
    }
  }
  if (text.includes("house") || text.includes("home") || text.includes("property")) {
    return {
      text: "The will leaves the family home at 1428 Linden Ave to Sarah, who is also the executor. The deed is held in sole ownership. Note: there's an active mortgage but no homeowner's insurance on file.",
      citations: [
        { id: "will", title: "Last Will & Testament" },
        { id: "deed", title: "Property Deed" },
      ],
    }
  }
  if (text.includes("beneficiary") || text.includes("401") || text.includes("retire")) {
    return {
      text: "Heads up: the Fidelity 401(k) ($310,000) still lists Linda Hwang, a former spouse, as beneficiary — which conflicts with the will. Retirement beneficiaries usually override a will, so this needs attention.",
      citations: [{ id: "retirement", title: "401(k) Retirement Account" }],
    }
  }
  return {
    text: "I can answer questions across all 8 documents in the vault — try asking about insurance, what bills are due, the house, or beneficiaries.",
    citations: [],
  }
}

export function AskAnchor() {
  const [value, setValue] = useState("")
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [asked, setAsked] = useState("")

  function submit(q: string) {
    const query = q.trim()
    if (!query) return
    setAsked(query)
    setAnswer(answerQuestion(query))
    setValue("")
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-chart-2" aria-hidden="true" />
        <h2 className="text-sm font-medium text-card-foreground">Ask Anchor</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about these documents…"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Ask Anchor a question"
        />
        <button
          type="submit"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          disabled={!value.trim()}
          aria-label="Send question"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </form>

      {!answer && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {answer && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">You asked:</span> {asked}
          </p>
          <div className="rounded-xl bg-secondary p-4">
            <p className="text-sm leading-relaxed text-secondary-foreground text-pretty">
              {answer.text}
            </p>
            {answer.citations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {answer.citations.map((c) => {
                  const doc = findDoc(c.id)
                  return (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                    >
                      <FileText className="size-3" aria-hidden="true" />
                      {doc?.title ?? c.title}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
