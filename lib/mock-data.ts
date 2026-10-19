export type DocCategory =
  | "Insurance"
  | "Legal"
  | "Financial"
  | "Property"
  | "Health"
  | "Digital"

export type ExtractedField = {
  label: string
  value: string
  /** Highlight fields the AI flagged as time-sensitive or important */
  emphasis?: boolean
}

export type VaultDocument = {
  id: string
  title: string
  category: DocCategory
  issuer: string
  /** One-line plain-language summary from the AI */
  summary: string
  /** Structured fields the AI extracted from the document */
  fields: ExtractedField[]
  /** ISO date string if the document or an obligation tied to it expires */
  expiresOn?: string
  uploadedOn: string
  pages: number
}

export type GapSeverity = "critical" | "warning" | "info"

export type DetectedGap = {
  id: string
  severity: GapSeverity
  title: string
  detail: string
  /** Document ids this gap references */
  relatedDocs: string[]
}

export type DeadlineUrgency = "overdue" | "soon" | "upcoming"

export type Deadline = {
  id: string
  title: string
  /** Days from "now" in the demo timeline */
  inDays: number
  urgency: DeadlineUrgency
  relatedDoc?: string
}

export type GriefStepStatus = "todo" | "done"

export type GriefStep = {
  id: string
  order: number
  title: string
  /** What to actually do */
  action: string
  /** Why it matters — the reassuring context */
  why: string
  urgency?: "urgent" | "thisWeek" | "later"
  /** Pre-grounded detail pulled from a document, e.g. a claim number */
  grounded?: { label: string; value: string }
  relatedDoc?: string
  status: GriefStepStatus
}

export const owner = {
  name: "David Hwang",
  initials: "DH",
  role: "Vault owner",
}

export const survivor = {
  name: "Sarah Hwang",
  initials: "SH",
  relationship: "Daughter",
}

export const documents: VaultDocument[] = [
  {
    id: "life-insurance",
    title: "Term Life Insurance Policy",
    category: "Insurance",
    issuer: "MetLife",
    summary:
      "A $500,000 term life policy. Sarah is the sole named beneficiary.",
    fields: [
      { label: "Policy number", value: "ML-4471-209-83", emphasis: true },
      { label: "Coverage", value: "$500,000" },
      { label: "Beneficiary", value: "Sarah Hwang (Daughter)" },
      { label: "Claims line", value: "1-800-638-5433", emphasis: true },
      { label: "Premium", value: "$62 / month" },
    ],
    uploadedOn: "2024-03-12",
    pages: 14,
  },
  {
    id: "will",
    title: "Last Will & Testament",
    category: "Legal",
    issuer: "Reyes & Cole LLP",
    summary:
      "Names Sarah as executor and primary heir. Leaves the family home to Sarah.",
    fields: [
      { label: "Executor", value: "Sarah Hwang", emphasis: true },
      { label: "Attorney", value: "Marcus Reyes" },
      { label: "Attorney phone", value: "(415) 555-0182" },
      { label: "Primary heir", value: "Sarah Hwang" },
      { label: "Signed", value: "August 4, 2023" },
    ],
    uploadedOn: "2024-03-12",
    pages: 9,
  },
  {
    id: "mortgage",
    title: "Home Mortgage Statement",
    category: "Property",
    issuer: "Wells Fargo Home Lending",
    summary:
      "Outstanding mortgage on the family home. A payment is due very soon.",
    fields: [
      { label: "Account number", value: "WF-008-552-1190", emphasis: true },
      { label: "Remaining balance", value: "$184,300" },
      { label: "Monthly payment", value: "$1,640", emphasis: true },
      { label: "Next payment due", value: "In 4 days", emphasis: true },
      { label: "Servicer phone", value: "1-800-357-6675" },
    ],
    expiresOn: "in-4-days",
    uploadedOn: "2024-09-01",
    pages: 4,
  },
  {
    id: "retirement",
    title: "401(k) Retirement Account",
    category: "Financial",
    issuer: "Fidelity",
    summary:
      "Retirement account valued at $310,000. Beneficiary on file does not match the will.",
    fields: [
      { label: "Account number", value: "FID-77-104-552" },
      { label: "Balance", value: "$310,000" },
      {
        label: "Beneficiary on file",
        value: "Linda Hwang (former spouse)",
        emphasis: true,
      },
      { label: "Plan administrator", value: "1-800-343-3548" },
    ],
    uploadedOn: "2024-03-12",
    pages: 6,
  },
  {
    id: "auto-insurance",
    title: "Auto Insurance Policy",
    category: "Insurance",
    issuer: "Geico",
    summary: "Coverage for the 2019 Honda CR-V. Renews soon.",
    fields: [
      { label: "Policy number", value: "GEC-22-901-44" },
      { label: "Vehicle", value: "2019 Honda CR-V" },
      { label: "Renews", value: "In 12 days", emphasis: true },
      { label: "Premium", value: "$118 / month" },
    ],
    expiresOn: "in-12-days",
    uploadedOn: "2024-06-20",
    pages: 8,
  },
  {
    id: "advance-directive",
    title: "Advance Healthcare Directive",
    category: "Health",
    issuer: "Self-prepared",
    summary:
      "Documents medical wishes and names Sarah as healthcare proxy.",
    fields: [
      { label: "Healthcare proxy", value: "Sarah Hwang", emphasis: true },
      { label: "Alternate proxy", value: "James Okafor" },
      { label: "Signed", value: "August 4, 2023" },
    ],
    uploadedOn: "2024-03-12",
    pages: 3,
  },
  {
    id: "deed",
    title: "Property Deed",
    category: "Property",
    issuer: "Alameda County Recorder",
    summary: "Title to the family home at 1428 Linden Ave.",
    fields: [
      { label: "Property", value: "1428 Linden Ave, Oakland CA" },
      { label: "Title held as", value: "Sole ownership" },
      { label: "Parcel", value: "APN 041-2233-018" },
    ],
    uploadedOn: "2024-03-12",
    pages: 2,
  },
  {
    id: "checking",
    title: "Primary Checking Account",
    category: "Financial",
    issuer: "Chase",
    summary:
      "Day-to-day account where autopay and direct deposits are set up.",
    fields: [
      { label: "Account (last 4)", value: "•••• 4471" },
      { label: "Balance", value: "$8,250" },
      { label: "Autopay linked", value: "Mortgage, utilities, 3 subscriptions" },
    ],
    uploadedOn: "2024-03-12",
    pages: 1,
  },
]

export const gaps: DetectedGap[] = [
  {
    id: "beneficiary-mismatch",
    severity: "critical",
    title: "Beneficiary mismatch on the 401(k)",
    detail:
      "The will leaves everything to Sarah, but the Fidelity 401(k) still lists Linda Hwang (former spouse) as beneficiary. Retirement beneficiaries override the will — this $310,000 could go to the wrong person.",
    relatedDocs: ["retirement", "will"],
  },
  {
    id: "no-home-insurance",
    severity: "warning",
    title: "No homeowner's insurance found",
    detail:
      "There's an active mortgage and a property deed on file, but no homeowner's insurance policy. The home may be uninsured.",
    relatedDocs: ["mortgage", "deed"],
  },
  {
    id: "no-poa",
    severity: "info",
    title: "No durable power of attorney",
    detail:
      "Anchor didn't find a financial power of attorney. Without one, no one can manage finances if David is incapacitated rather than deceased.",
    relatedDocs: [],
  },
]

export const deadlines: Deadline[] = [
  {
    id: "mortgage-due",
    title: "Mortgage payment due",
    inDays: 4,
    urgency: "soon",
    relatedDoc: "mortgage",
  },
  {
    id: "auto-renew",
    title: "Auto insurance renewal",
    inDays: 12,
    urgency: "upcoming",
    relatedDoc: "auto-insurance",
  },
  {
    id: "probate-window",
    title: "Recommended probate filing window",
    inDays: 30,
    urgency: "upcoming",
    relatedDoc: "will",
  },
]

export const griefSteps: GriefStep[] = [
  {
    id: "death-certificates",
    order: 1,
    title: "Order certified death certificates",
    action:
      "Request 10–12 certified copies from the funeral home or county vital records. Almost every step below will ask for one.",
    why: "Banks, insurers, and the court each keep an original. Ordering enough now saves weeks of back-and-forth later.",
    urgency: "urgent",
    status: "todo",
  },
  {
    id: "file-life-claim",
    order: 2,
    title: "File the life insurance claim",
    action:
      "Call MetLife to start the claim. You're the named beneficiary, so this should be straightforward.",
    why: "This $500,000 benefit is often the fastest source of funds to cover immediate costs.",
    urgency: "urgent",
    grounded: { label: "Policy & claims line", value: "ML-4471-209-83 · 1-800-638-5433" },
    relatedDoc: "life-insurance",
    status: "todo",
  },
  {
    id: "mortgage-payment",
    order: 3,
    title: "Cover the mortgage payment due in 4 days",
    action:
      "Make the payment from the Chase checking account, or call Wells Fargo to discuss options while the estate is settled.",
    why: "Keeping the mortgage current protects the family home from default while everything else is handled.",
    urgency: "urgent",
    grounded: { label: "Loan account", value: "WF-008-552-1190 · $1,640 due" },
    relatedDoc: "mortgage",
    status: "todo",
  },
  {
    id: "fix-beneficiary",
    order: 4,
    title: "Resolve the 401(k) beneficiary issue",
    action:
      "Call Fidelity and David's attorney. The account still names a former spouse and may not pass through the will.",
    why: "Catching this early can prevent $310,000 from going to the wrong person and a costly legal dispute.",
    urgency: "thisWeek",
    grounded: { label: "Account & administrator", value: "FID-77-104-552 · 1-800-343-3548" },
    relatedDoc: "retirement",
    status: "todo",
  },
  {
    id: "notify-ssa",
    order: 5,
    title: "Notify Social Security & employer",
    action:
      "Report the death to the Social Security Administration and David's employer to stop or transfer benefits.",
    why: "Stops overpayments you'd have to return later and starts any survivor benefits you may be owed.",
    urgency: "thisWeek",
    status: "todo",
  },
  {
    id: "file-will",
    order: 6,
    title: "File the will with probate court",
    action:
      "Bring the will to the county court. You're named executor, so you can begin settling the estate.",
    why: "Filing opens the legal process so assets can be transferred to you and other heirs.",
    urgency: "thisWeek",
    grounded: { label: "Estate attorney", value: "Marcus Reyes · (415) 555-0182" },
    relatedDoc: "will",
    status: "todo",
  },
  {
    id: "cancel-autopay",
    order: 7,
    title: "Review autopay & subscriptions",
    action:
      "Check the Chase account for recurring charges. Keep utilities, pause or cancel the rest.",
    why: "Stops money leaking out on services no longer needed, without cutting off anything essential.",
    urgency: "later",
    relatedDoc: "checking",
    status: "todo",
  },
  {
    id: "digital-accounts",
    order: 8,
    title: "Memorialize digital accounts",
    action:
      "Secure email and photos, then memorialize or close social media when you're ready. There's no rush.",
    why: "Protects against fraud and preserves photos and messages you may want to keep.",
    urgency: "later",
    status: "todo",
  },
]
