import { AlertTriangle, Clock, Info, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { gaps, deadlines, type GapSeverity } from "@/lib/mock-data"

const severityStyles: Record<
  GapSeverity,
  { icon: typeof AlertTriangle; ring: string; chip: string; label: string }
> = {
  critical: {
    icon: ShieldAlert,
    ring: "border-destructive/30 bg-destructive/5",
    chip: "bg-destructive/10 text-destructive",
    label: "Needs attention",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-chart-3/30 bg-chart-3/5",
    chip: "bg-chart-3/10 text-chart-3",
    label: "Worth a look",
  },
  info: {
    icon: Info,
    ring: "border-border bg-secondary/50",
    chip: "bg-secondary text-muted-foreground",
    label: "Suggestion",
  },
}

export function AlertsPanel() {
  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            What Anchor noticed
          </h2>
          <span className="text-xs text-muted-foreground">
            {gaps.length} findings
          </span>
        </div>
        <div className="space-y-3">
          {gaps.map((gap) => {
            const s = severityStyles[gap.severity]
            const Icon = s.icon
            return (
              <div
                key={gap.id}
                className={cn("rounded-2xl border p-4", s.ring)}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={cn(
                      "mt-0.5 size-5 shrink-0",
                      gap.severity === "critical" && "text-destructive",
                      gap.severity === "warning" && "text-chart-3",
                      gap.severity === "info" && "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {gap.title}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          s.chip,
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {gap.detail}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-foreground">
          Upcoming deadlines
        </h2>
        <ul className="overflow-hidden rounded-2xl border border-border bg-card">
          {deadlines.map((d, i) => (
            <li
              key={d.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                i > 0 && "border-t border-border",
              )}
            >
              <Clock
                className={cn(
                  "size-4 shrink-0",
                  d.urgency === "soon" ? "text-destructive" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="flex-1 text-sm text-card-foreground">
                {d.title}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  d.urgency === "soon"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                in {d.inDays} days
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
