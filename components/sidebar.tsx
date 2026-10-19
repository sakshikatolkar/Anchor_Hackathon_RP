"use client"

import { Anchor, Vault, Users, LifeBuoy, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { owner, documents } from "@/lib/mock-data"

export type AppMode = "vault" | "grief"

export function Sidebar({
  mode,
  onActivateGrief,
}: {
  mode: AppMode
  onActivateGrief: () => void
}) {
  return (
    <aside className="flex h-full flex-col gap-6 border-r border-sidebar-border bg-sidebar p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Anchor className="size-5" aria-hidden="true" />
        </span>
        <span className="font-serif text-xl text-sidebar-foreground">Anchor</span>
      </div>

      <nav className="flex flex-col gap-1">
        <span
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
            mode === "vault"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/70",
          )}
        >
          <Vault className="size-4" aria-hidden="true" />
          The Vault
        </span>
        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50">
          <Users className="size-4" aria-hidden="true" />
          People & Access
        </span>
        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50">
          <Lock className="size-4" aria-hidden="true" />
          Security
        </span>
      </nav>

      <div className="mt-auto space-y-4">
        {mode === "vault" && (
          <button
            type="button"
            onClick={onActivateGrief}
            className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-card px-3 py-3 text-left transition-colors hover:bg-accent"
          >
            <LifeBuoy className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-sm">
              <span className="block font-medium text-card-foreground">
                Grief Mode
              </span>
              <span className="block text-xs text-muted-foreground">
                A guided plan for hard days
              </span>
            </span>
          </button>
        )}

        <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {owner.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {owner.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {documents.length} documents secured
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}
