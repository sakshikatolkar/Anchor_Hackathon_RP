"use client"

import { useState } from "react"
import { ChevronDown, Sparkles, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { categoryMeta } from "@/lib/categories"
import type { VaultDocument } from "@/lib/mock-data"

export function DocumentCard({ doc }: { doc: VaultDocument }) {
  const [open, setOpen] = useState(false)
  const { icon: Icon, tint } = categoryMeta[doc.category]

  return (
    <div className="rounded-2xl border border-border bg-card transition-shadow hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary",
            tint,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium text-card-foreground">
              {doc.title}
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {doc.issuer}
          </span>
          <span className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
            <Sparkles
              className="mt-0.5 size-3.5 shrink-0 text-chart-2"
              aria-hidden="true"
            />
            <span className="text-pretty">{doc.summary}</span>
          </span>
        </span>

        <ChevronDown
          className={cn(
            "mt-1 size-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5 text-chart-2" aria-hidden="true" />
            Extracted by Anchor
          </p>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {doc.fields.map((field) => (
              <div
                key={field.label}
                className="flex flex-col gap-0.5 border-b border-border/60 pb-2"
              >
                <dt className="text-xs text-muted-foreground">{field.label}</dt>
                <dd
                  className={cn(
                    "text-sm font-medium text-card-foreground",
                    field.emphasis && "text-primary",
                  )}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" aria-hidden="true" />
            {doc.pages} pages · added{" "}
            {new Date(doc.uploadedOn).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            <Badge variant="secondary" className="ml-auto font-normal">
              {doc.category}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
