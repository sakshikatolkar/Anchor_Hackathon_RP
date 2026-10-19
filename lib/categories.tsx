import {
  Shield,
  Scale,
  Landmark,
  Home,
  HeartPulse,
  Cloud,
  type LucideIcon,
} from "lucide-react"
import type { DocCategory } from "@/lib/mock-data"

export const categoryMeta: Record<
  DocCategory,
  { icon: LucideIcon; tint: string }
> = {
  Insurance: { icon: Shield, tint: "text-chart-1" },
  Legal: { icon: Scale, tint: "text-primary" },
  Financial: { icon: Landmark, tint: "text-chart-5" },
  Property: { icon: Home, tint: "text-chart-2" },
  Health: { icon: HeartPulse, tint: "text-destructive" },
  Digital: { icon: Cloud, tint: "text-chart-2" },
}
