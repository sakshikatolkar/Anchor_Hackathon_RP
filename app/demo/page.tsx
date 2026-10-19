"use client"

import { useState } from "react"
import { Anchor, LifeBuoy, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Sidebar, type AppMode } from "@/components/sidebar"
import { VaultView } from "@/components/vault-view"
import { GriefMode } from "@/components/grief-mode"

export default function DemoPage() {
  const [mode, setMode] = useState<AppMode>("vault")

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar mode={mode} onActivateGrief={() => setMode("grief")} />
      </div>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-sidebar px-5 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Anchor className="size-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg text-foreground">Anchor</span>
        </Link>
        <button
          type="button"
          onClick={() => setMode(mode === "grief" ? "vault" : "grief")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground"
        >
          {mode === "grief" ? (
            <>
              <X className="size-4" aria-hidden="true" />
              Exit
            </>
          ) : (
            <>
              <LifeBuoy className="size-4 text-primary" aria-hidden="true" />
              Grief Mode
            </>
          )}
        </button>
      </header>

      <main className="min-w-0">
        <div className="hidden border-b border-border bg-card/60 px-8 py-2.5 lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to site
          </Link>
        </div>
        {mode === "vault" ? (
          <VaultView />
        ) : (
          <GriefMode onExit={() => setMode("vault")} />
        )}
      </main>
    </div>
  )
}
