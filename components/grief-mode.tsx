"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  Check,
  Phone,
  FileText,
  Heart,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { griefSteps, survivor, documents, type GriefStep } from "@/lib/mock-data"

const groups: { key: GriefStep["urgency"]; label: string; hint: string }[] = [
  { key: "urgent", label: "Right now", hint: "Time-sensitive — handle these first" },
  { key: "thisWeek", label: "This week", hint: "Important, but you have a little time" },
  { key: "later", label: "When you're ready", hint: "No rush at all" },
]

function docTitle(id?: string) {
  return documents.find((d) => d.id === id)?.title
}

export function GriefMode({ onExit }: { onExit: () => void }) {
  const [done, setDone] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const completed = done.size
  const total = griefSteps.length
  const pct = useMemo(() => Math.round((completed / total) * 100), [completed, total])

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <button
        type="button"
        onClick={onExit}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to the vault
      </button>

      <header className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Heart className="size-3.5" aria-hidden="true" />
          Grief Mode
        </span>
        <h1 className="mt-4 text-pretty text-3xl font-medium text-foreground sm:text-4xl">
          We&apos;re so sorry, {survivor.name.split(" ")[0]}.
        </h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          You don&apos;t have to figure out what comes next. Anchor read through
          your dad&apos;s documents and turned everything into a few clear steps.
          Take them one at a time — we&apos;ll keep your place.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your progress</span>
            <span className="font-medium text-foreground">
              {completed} of {total} done
            </span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const steps = griefSteps.filter((s) => s.urgency === group.key)
          if (steps.length === 0) return null
          return (
            <section key={group.key}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-lg font-medium text-foreground">
                  {group.label}
                </h2>
                <span className="text-xs text-muted-foreground">{group.hint}</span>
              </div>
              <ol className="space-y-3">
                {steps.map((step) => {
                  const isDone = done.has(step.id)
                  return (
                    <li
                      key={step.id}
                      className={cn(
                        "rounded-2xl border border-border bg-card p-5 transition-colors",
                        isDone && "bg-secondary/50",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => toggle(step.id)}
                          aria-pressed={isDone}
                          aria-label={
                            isDone ? `Mark "${step.title}" not done` : `Mark "${step.title}" done`
                          }
                          className={cn(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            isDone
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-transparent hover:border-primary",
                          )}
                        >
                          <Check className="size-3.5" aria-hidden="true" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <h3
                            className={cn(
                              "text-pretty font-medium text-foreground",
                              isDone && "text-muted-foreground line-through",
                            )}
                          >
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                            {step.action}
                          </p>

                          {step.grounded && (
                            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary px-3 py-2">
                              <Phone
                                className="mt-0.5 size-3.5 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <span className="text-sm">
                                <span className="block text-xs text-muted-foreground">
                                  {step.grounded.label}
                                </span>
                                <span className="font-medium text-foreground">
                                  {step.grounded.value}
                                </span>
                              </span>
                            </div>
                          )}

                          <div className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                            <CircleDot
                              className="mt-0.5 size-3.5 shrink-0 text-chart-2"
                              aria-hidden="true"
                            />
                            <span className="text-pretty">
                              <span className="text-foreground/80">Why this helps: </span>
                              {step.why}
                            </span>
                          </div>

                          {step.relatedDoc && (
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                              <FileText className="size-3" aria-hidden="true" />
                              From: {docTitle(step.relatedDoc)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground text-pretty">
        Take all the time you need. Anchor will be here whenever you&apos;re ready
        to continue.
      </p>
    </div>
  )
}
