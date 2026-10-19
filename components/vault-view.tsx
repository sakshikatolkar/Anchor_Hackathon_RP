"use client"

import { ShieldCheck, Plus } from "lucide-react"
import { documents } from "@/lib/mock-data"
import { DocumentCard } from "@/components/document-card"
import { AskAnchor } from "@/components/ask-anchor"
import { AlertsPanel } from "@/components/alerts-panel"

export function VaultView() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-chart-5">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>End-to-end encrypted · only you and your circle can open this</span>
        </div>
        <h1 className="mt-3 text-pretty text-3xl font-medium text-foreground sm:text-4xl">
          Everything that matters, in one calm place.
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
          Anchor reads each document you add, pulls out the details that matter,
          and quietly watches for gaps and deadlines so nothing slips through.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AskAnchor />

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">
              Documents
              <span className="ml-2 text-muted-foreground">
                {documents.length}
              </span>
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add document
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <AlertsPanel />
        </div>
      </div>
    </div>
  )
}
