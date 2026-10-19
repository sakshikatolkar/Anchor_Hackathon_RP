'use client'

import { AgentChat } from '@/components/agent-chat'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  FileArchive,
  FileText,
  FolderOpen,
  HeartPulse,
  Home,
  Landmark,
  Link2,
  Lock,
  LogOut,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'

type Visibility = 'Private' | 'Family' | 'Emergency'
type Status = 'Analyzed' | 'Needs Review'
type Tab = 'Overview' | 'Details' | 'Preview'

type VaultDoc = {
  id: string
  name: string
  category: string
  type: string
  size: string
  uploadedOn: string
  visibility: Visibility
  status: Status
  mimeType: string
  dataUrl?: string
  s3Url?: string
  canDelete: boolean
  isShared: boolean
  summary: string
  details: { label: string; value: string }[]
  nextSteps: string[]
  related: string[]
}

type ChecklistItem = {
  label: string
  category: string
  priority: 'Critical' | 'High' | 'Medium'
  weight: number
  keywords: string[]
}

const CATEGORIES = [
  { title: 'All', subtitle: 'Everything', icon: FolderOpen },
  { title: 'Identity', subtitle: 'Passport, IDs', icon: ShieldCheck },
  { title: 'Immigration', subtitle: 'Visa, I-20, I-94', icon: FileArchive },
  { title: 'Housing', subtitle: 'Lease, property', icon: Home },
  { title: 'Insurance', subtitle: 'Health, auto, home', icon: HeartPulse },
  {
    title: 'Medical',
    subtitle: 'Reports, prescriptions',
    icon: BriefcaseBusiness,
  },
  { title: 'Financial', subtitle: 'Loans, banks, tax', icon: Landmark },
  { title: 'Legal', subtitle: 'Contracts, POA', icon: Scale },
  { title: 'Other', subtitle: 'Not sure / misc', icon: FolderOpen },
]

const UPLOAD_CATEGORIES = CATEGORIES.filter(
  (category) => category.title !== 'All',
)

const CHECKLIST: ChecklistItem[] = [
  {
    label: 'Government ID / Passport',
    category: 'Identity',
    priority: 'Critical',
    weight: 18,
    keywords: ['passport', 'identity', 'id', 'driver', 'license'],
  },
  {
    label: 'Health / Life Insurance',
    category: 'Insurance',
    priority: 'Critical',
    weight: 16,
    keywords: ['insurance', 'policy', 'claim', 'coverage'],
  },
  {
    label: 'Medical Records',
    category: 'Medical',
    priority: 'High',
    weight: 14,
    keywords: ['medical', 'hospital', 'doctor', 'report', 'prescription'],
  },
  {
    label: 'Lease / Property Proof',
    category: 'Housing',
    priority: 'High',
    weight: 12,
    keywords: ['lease', 'rent', 'housing', 'property', 'address'],
  },
  {
    label: 'Immigration Documents',
    category: 'Immigration',
    priority: 'High',
    weight: 12,
    keywords: ['visa', 'immigration', 'i-20', 'i20', 'i-94', 'i94'],
  },
  {
    label: 'Bank / Loan / Tax Records',
    category: 'Financial',
    priority: 'High',
    weight: 12,
    keywords: ['bank', 'loan', 'tax', 'financial', 'statement'],
  },
  {
    label: 'Legal Documents',
    category: 'Legal',
    priority: 'Medium',
    weight: 10,
    keywords: ['legal', 'contract', 'will', 'poa', 'power of attorney'],
  },
  {
    label: 'Emergency Instructions',
    category: 'Other',
    priority: 'Medium',
    weight: 6,
    keywords: ['emergency', 'instruction', 'contact', 'note'],
  },
]

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDate(value?: string) {
  if (!value) return todayLabel()

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return todayLabel()

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function normalizeCategory(category?: string) {
  const valid = UPLOAD_CATEGORIES.some((item) => item.title === category)
  return valid && category ? category : 'Other'
}

function normalizeVisibility(value?: string): Visibility {
  if (value === 'Family') return 'Family'
  if (value === 'Emergency') return 'Emergency'
  return 'Private'
}

function visibilityStyle(visibility: Visibility) {
  if (visibility === 'Private') return 'bg-[#0D1321] text-[#F0EBD8]'
  if (visibility === 'Family') return 'bg-[#748CAB]/30 text-[#1D2D44]'
  return 'bg-[#3E5C76] text-[#F0EBD8]'
}

function getDefaultVisibility(category: string): Visibility {
  if (category === 'Insurance' || category === 'Medical') return 'Emergency'
  if (category === 'Housing') return 'Family'
  return 'Private'
}

function getCategoryContent(category: string) {
  if (category === 'Immigration') {
    return {
      type: 'Immigration Document',
      summary:
        'This document may support your immigration process. It may include status, travel, identity, address, or deadline information.',
      details: [
        { label: 'Document Type', value: 'Immigration Document' },
        { label: 'Useful For', value: 'Visa, status, travel, filing' },
        { label: 'Review Needed', value: 'Check dates and document name' },
        { label: 'Visibility', value: 'Private' },
      ],
      nextSteps: [
        'Check expiry or filing dates',
        'Keep passport and ID nearby',
        'Add lease if address proof is needed',
      ],
      related: ['Passport', 'Lease Agreement', 'I-94', 'Bank Statement'],
    }
  }

  if (category === 'Housing') {
    return {
      type: 'Housing Document',
      summary:
        'This document may confirm your address, lease terms, landlord details, property ownership, or housing responsibilities.',
      details: [
        { label: 'Document Type', value: 'Housing Document' },
        { label: 'Useful For', value: 'Address proof, housing records' },
        { label: 'Review Needed', value: 'Check start and end dates' },
        { label: 'Visibility', value: 'Family' },
      ],
      nextSteps: [
        'Confirm lease or property dates',
        'Save landlord or property contact',
        'Keep payment proof nearby',
      ],
      related: ['Immigration File', 'Bank Statement', 'Government ID'],
    }
  }

  if (category === 'Insurance') {
    return {
      type: 'Insurance Policy',
      summary:
        'This insurance document may help during claims, emergencies, hospitalization, travel, or financial recovery.',
      details: [
        { label: 'Document Type', value: 'Insurance Policy' },
        { label: 'Useful For', value: 'Claims and emergency support' },
        { label: 'Review Needed', value: 'Check coverage and renewal date' },
        { label: 'Visibility', value: 'Emergency' },
      ],
      nextSteps: [
        'Save provider contact',
        'Verify nominee details',
        'Keep ID and related reports nearby',
      ],
      related: ['Government ID', 'Medical Reports', 'Claim Form'],
    }
  }

  if (category === 'Medical') {
    return {
      type: 'Medical Document',
      summary:
        'This medical document may help explain diagnosis, treatment, prescriptions, test results, or care instructions.',
      details: [
        { label: 'Document Type', value: 'Medical Record' },
        { label: 'Useful For', value: 'Hospital, doctor, insurance' },
        { label: 'Review Needed', value: 'Check dates and provider name' },
        { label: 'Visibility', value: 'Emergency' },
      ],
      nextSteps: [
        'Store doctor contact',
        'Add insurance policy',
        'Keep current prescriptions updated',
      ],
      related: ['Insurance Policy', 'Hospital Card', 'Government ID'],
    }
  }

  if (category === 'Financial') {
    return {
      type: 'Financial Document',
      summary:
        'This document may contain bank, loan, tax, investment, or payment information that is useful for planning and verification.',
      details: [
        { label: 'Document Type', value: 'Financial Document' },
        { label: 'Useful For', value: 'Banking, tax, loans' },
        { label: 'Review Needed', value: 'Check account or reference number' },
        { label: 'Visibility', value: 'Private' },
      ],
      nextSteps: [
        'Verify account details',
        'Add related loan or tax documents',
        'Set access carefully',
      ],
      related: ['Tax Document', 'Loan Agreement', 'Bank Statement'],
    }
  }

  if (category === 'Legal') {
    return {
      type: 'Legal Document',
      summary:
        'This legal document may define rights, responsibilities, permissions, contracts, or family instructions.',
      details: [
        { label: 'Document Type', value: 'Legal Document' },
        { label: 'Useful For', value: 'Legal proof and instructions' },
        { label: 'Review Needed', value: 'Check parties and dates' },
        { label: 'Visibility', value: 'Private' },
      ],
      nextSteps: [
        'Check signature and date',
        'Add related ID documents',
        'Share only with trusted contacts',
      ],
      related: ['Government ID', 'Trusted Contact', 'Financial Records'],
    }
  }

  if (category === 'Identity') {
    return {
      type: 'Identity Document',
      summary:
        'This document helps prove identity. It may be needed for travel, immigration, banking, housing, and emergency verification.',
      details: [
        { label: 'Document Type', value: 'Identity Document' },
        { label: 'Useful For', value: 'ID proof and verification' },
        { label: 'Review Needed', value: 'Check expiry date' },
        { label: 'Visibility', value: 'Private' },
      ],
      nextSteps: [
        'Check expiration date',
        'Store related visa or address proof',
        'Keep a backup copy',
      ],
      related: ['Passport', 'Visa', 'Driver License'],
    }
  }

  return {
    type: 'Important Document',
    summary:
      'This document has been added to your vault. Review it, set the right access level, and connect any related documents.',
    details: [
      { label: 'Document Type', value: 'Important Document' },
      { label: 'Useful For', value: 'Family and emergency planning' },
      { label: 'Review Needed', value: 'Check important details' },
      { label: 'Visibility', value: 'Private' },
    ],
    nextSteps: [
      'Review document contents',
      'Set correct visibility',
      'Add related documents',
    ],
    related: ['Government ID', 'Emergency Contact', 'Insurance'],
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function createLocalDoc(file: File, category: string): Promise<VaultDoc> {
  const safeCategory = normalizeCategory(category)
  const content = getCategoryContent(safeCategory)
  const visibility = getDefaultVisibility(safeCategory)

  let dataUrl = ''

  try {
    if (file.size <= 5_000_000) {
      dataUrl = await fileToDataUrl(file)
    }
  } catch {
    dataUrl = ''
  }

  return {
    id: crypto.randomUUID(),
    name: file.name,
    category: safeCategory,
    type: content.type,
    size: formatFileSize(file.size),
    uploadedOn: todayLabel(),
    visibility,
    status: 'Analyzed',
    mimeType: file.type || 'unknown',
    dataUrl,
    canDelete: true,
    isShared: false,
    summary: content.summary,
    details: content.details.map((detail) =>
      detail.label === 'Visibility' ? { ...detail, value: visibility } : detail,
    ),
    nextSteps: content.nextSteps,
    related: content.related,
  }
}

function apiRowToVaultDoc(row: Record<string, any>): VaultDoc {
  const category = normalizeCategory(row.category)
  const content = getCategoryContent(category)
  const visibility = normalizeVisibility(row.visibility)

  return {
    id: String(row.id || crypto.randomUUID()),
    name: String(row.file_name || row.name || 'Uploaded document'),
    category,
    type: content.type,
    size: String(row.size || ''),
    uploadedOn: formatDate(row.uploaded_at || row.created_at),
    visibility,
    status: 'Analyzed',
    mimeType: String(row.mime_type || row.type || ''),
    s3Url: row.view_url || row.s3_url || row.url,
    canDelete: row.can_delete !== false,
    isShared: row.is_shared === true,
    summary: content.summary,
    details: content.details.map((detail) =>
      detail.label === 'Visibility' ? { ...detail, value: visibility } : detail,
    ),
    nextSteps: content.nextSteps,
    related: content.related,
  }
}

export default function UploadPage() {
  const [docs, setDocs] = useState<VaultDoc[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Other')
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [sharing, setSharing] = useState(false)
  const [showDocPanel, setShowDocPanel] = useState(false)

  async function fetchDocs() {
    try {
      setErrorMessage('')
      const response = await fetch('/api/documents', {
        cache: 'no-store',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        setErrorMessage(error?.error || 'Could not load your documents.')
        setDocs([])
        setSelectedId('')
        setShowDocPanel(false)
        return []
      }

      const json = await response.json()
      const apiDocs = Array.isArray(json.docs) ? json.docs : []
      const mapped = apiDocs.map(apiRowToVaultDoc)

      setDocs(mapped)
      setSelectedId('')
      setShowDocPanel(false)

      return mapped
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load your documents.'
      setErrorMessage(message)
      setDocs([])
      setSelectedId('')
      setShowDocPanel(false)
      return []
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const selectedDoc = useMemo(() => {
    if (!showDocPanel || !selectedId) return undefined
    return docs.find((doc) => doc.id === selectedId)
  }, [docs, selectedId, showDocPanel])

  const checklistWithStatus = useMemo(() => {
    return CHECKLIST.map((item) => {
      const completed = docs.some((doc) => {
        const haystack = `${doc.name} ${doc.category} ${doc.type}`.toLowerCase()

        return (
          doc.category === item.category ||
          item.keywords.some((keyword) => haystack.includes(keyword))
        )
      })

      return { ...item, completed }
    })
  }, [docs])

  const vaultHealth = useMemo(() => {
    const total = CHECKLIST.reduce((sum, item) => sum + item.weight, 0)
    const completed = checklistWithStatus.reduce((sum, item) => {
      return item.completed ? sum + item.weight : sum
    }, 0)

    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }, [checklistWithStatus])

  const filteredDocs = useMemo(() => {
    const q = search.toLowerCase().trim()

    return docs.filter((doc) => {
      const matchesCategory =
        activeCategory === 'All' || doc.category === activeCategory

      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.type.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [docs, search, activeCategory])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const category = normalizeCategory(selectedCategory)
    const fileArray = Array.from(files)

    setSelectedFiles(fileArray)
    setUploading(true)
    setErrorMessage('')

    const uploadErrors: string[] = []

    for (const file of fileArray) {
      const visibility = getDefaultVisibility(category)

      const form = new FormData()
      form.append('file', file)
      form.append('category', category)
      form.append('visibility', visibility)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: form,
        })

        if (!response.ok) {
          const error = await response.json().catch(() => null)
          uploadErrors.push(error?.error || `Could not upload ${file.name}.`)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : `Could not upload ${file.name}.`
        uploadErrors.push(message)
      }
    }

    const apiDocs = await fetchDocs()

    if (uploadErrors.length > 0) {
      setErrorMessage(uploadErrors.join(' '))
    } else if (apiDocs.length > 0) {
      setSelectedId(apiDocs[0].id)
      setShowDocPanel(true)
    }

    setActiveCategory(category)
    setActiveTab('Overview')
    setUploading(false)
  }

  async function deleteDoc(id: string) {
    const target = docs.find((doc) => doc.id === id)

    if (target && !window.confirm(`Delete ${target.name}? This cannot be undone.`)) {
      return
    }

    const remainingDocs = docs.filter((doc) => doc.id !== id)
    setDocs(remainingDocs)

    if (selectedId === id) {
      setSelectedId('')
      setShowDocPanel(false)
    }

    try {
      await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch {
      // Demo fallback.
    }
  }

  async function updateVisibility(visibility: Visibility) {
    if (!selectedDoc) return

    setDocs((previousDocs) =>
      previousDocs.map((doc) =>
        doc.id === selectedDoc.id
          ? {
              ...doc,
              visibility,
              details: doc.details.map((detail) =>
                detail.label === 'Visibility'
                  ? { ...detail, value: visibility }
                  : detail,
              ),
            }
          : doc,
      ),
    )

    try {
      await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDoc.id,
          visibility,
        }),
      })
    } catch {
      // Demo fallback.
    }
  }

  async function generateShareLink() {
    setSharing(true)
    setErrorMessage('')
    setShareMessage('')

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Family' }),
      })
      const json = await response.json()

      if (!response.ok || !json.url) {
        throw new Error(json.error || 'Could not create share link.')
      }

      try {
        await navigator.clipboard.writeText(json.url)
        setShareMessage('Vault invite link copied to clipboard.')
      } catch {
        setShareMessage(`Vault invite link: ${json.url}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create share link.'
      setErrorMessage(message)
    } finally {
      setSharing(false)
    }
  }

  function resetDemoVault() {
    setDocs([])
    setSelectedId('')
    setSelectedFiles([])
    setActiveCategory('All')
    setShowDocPanel(false)
  }

  return (
    <main className="min-h-screen bg-[#F0EBD8] text-[#0D1321]">
      <div
        className={`grid min-h-screen ${
          selectedDoc
            ? 'lg:grid-cols-[320px_1fr_430px]'
            : 'lg:grid-cols-[320px_1fr]'
        }`}
      >
        <aside className="hidden border-r border-[#0D1321]/10 bg-[#F0EBD8] p-6 lg:block">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D1321] text-[#F0EBD8]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-black text-[#0D1321]">Anchor</p>
              <p className="text-xs text-[#3E5C76]">Personal Vault</p>
            </div>
          </Link>

          <div className="mb-6 rounded-[2rem] border border-[#3E5C76]/20 bg-[#F7F2DF] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-[#0D1321]">
                  Vault Health
                </p>
                <p className="text-xs text-[#3E5C76]">
                  Priority-based readiness
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[8px] border-[#748CAB]">
                <p className="text-lg font-black">{vaultHealth}%</p>
              </div>
            </div>

            <div className="space-y-2">
              {checklistWithStatus.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 rounded-xl bg-white/55 px-3 py-2"
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      item.completed ? 'text-[#3E5C76]' : 'text-[#0D1321]/20'
                    }`}
                  />

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold ${
                        item.completed ? 'text-[#0D1321]' : 'text-[#3E5C76]'
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="text-[11px] text-[#3E5C76]">
                      {item.priority} · {item.weight} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <nav className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-[#748CAB]/25 px-4 py-3 text-left text-sm font-bold text-[#0D1321]">
              <FileText className="h-5 w-5" />
              Documents
            </button>

            <div className="rounded-[1.5rem] border border-[#0D1321]/10 bg-[#F7F2DF] p-3">
              <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.22em] text-[#3E5C76]">
                Categories
              </p>

              <div className="space-y-1.5">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon
                  const count =
                    category.title === 'All'
                      ? docs.length
                      : docs.filter((doc) => doc.category === category.title)
                          .length

                  return (
                    <button
                      key={category.title}
                      onClick={() => setActiveCategory(category.title)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                        activeCategory === category.title
                          ? 'bg-[#0D1321] text-[#F0EBD8]'
                          : 'text-[#3E5C76] hover:bg-[#748CAB]/15 hover:text-[#0D1321]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {category.title}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          activeCategory === category.title
                            ? 'bg-[#F0EBD8] text-[#0D1321]'
                            : 'bg-white text-[#3E5C76]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>

          <button
            onClick={resetDemoVault}
            className="mt-6 w-full rounded-2xl border border-[#0D1321]/10 px-4 py-3 text-sm font-bold text-[#3E5C76] transition hover:bg-[#0D1321] hover:text-[#F0EBD8]"
          >
            Reset demo vault
          </button>
        </aside>

        <section className="p-5 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[#0D1321]/10 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-[#3E5C76]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search anything in your vault..."
                className="w-full bg-transparent text-sm text-[#0D1321] outline-none placeholder:text-[#3E5C76]/60"
              />
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-[#0D1321] px-5 py-3 text-sm font-bold text-[#F0EBD8] transition hover:bg-[#3E5C76]"
            >
              Sign out
            </button>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-[#3E5C76]">
              Document Upload
            </p>

            <h1 className="text-5xl font-black tracking-[-0.05em]">
              Upload Document
            </h1>

            <p className="mt-2 text-[#3E5C76]">
              Choose a category first, then upload your file.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-red-900/20 bg-red-50 px-5 py-4 text-sm font-semibold text-red-900">
              {errorMessage}
            </div>
          )}

          <div className="mb-5 rounded-[1.5rem] border border-[#0D1321]/10 bg-white p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#0D1321]">
                Document category
              </span>

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-2xl border border-[#0D1321]/10 bg-[#F0EBD8] px-4 py-4 text-sm font-semibold text-[#0D1321] outline-none focus:border-[#3E5C76]"
              >
                {UPLOAD_CATEGORIES.map((category) => (
                  <option key={category.title} value={category.title}>
                    {category.title} — {category.subtitle}
                  </option>
                ))}
              </select>
            </label>

            <p className="mt-3 text-sm text-[#3E5C76]">
              Not sure? Choose <span className="font-bold">Other</span>. You can
              update it later.
            </p>
          </div>

          <label
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              handleFiles(event.dataTransfer.files)
            }}
            className={`group mb-8 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 text-center transition ${
              isDragging
                ? 'border-[#0D1321] bg-[#748CAB]/20'
                : 'border-[#748CAB] bg-white hover:bg-[#748CAB]/10'
            }`}
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#748CAB]/25 text-[#1D2D44]">
              <UploadCloud className="h-8 w-8" />
            </div>

            <p className="text-xl font-black text-[#0D1321]">
              {uploading ? 'Uploading to vault…' : 'Drag and drop files here'}
            </p>

            <p className="mt-2 text-sm text-[#3E5C76]">
              Uploading as{' '}
              <span className="font-bold text-[#0D1321]">
                {selectedCategory}
              </span>
            </p>

            <span className="mt-5 rounded-full bg-[#0D1321] px-6 py-3 text-sm font-bold text-[#F0EBD8] transition group-hover:bg-[#3E5C76]">
              {uploading ? 'Uploading…' : 'Browse Files'}
            </span>

            <p className="mt-5 text-xs text-[#3E5C76]">
              Supported: PDF, JPG, PNG, DOCX.
            </p>

            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
              disabled={uploading}
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="mb-8 flex items-center justify-between rounded-2xl border border-[#748CAB]/30 bg-[#748CAB]/15 px-5 py-4">
              <p className="text-sm font-semibold text-[#1D2D44]">
                {selectedFiles.length} file
                {selectedFiles.length > 1 ? 's' : ''} added under{' '}
                <span className="font-black">{selectedCategory}</span>.
              </p>

              <button
                onClick={() => setSelectedFiles([])}
                className="text-[#3E5C76] hover:text-[#0D1321]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Recent Uploads</h2>

                <p className="text-sm text-[#3E5C76]">
                  Showing{' '}
                  {activeCategory === 'All' ? 'all documents' : activeCategory}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-[#3E5C76]">
                  {filteredDocs.length} document
                  {filteredDocs.length === 1 ? '' : 's'}
                </p>

                <button
                  type="button"
                  onClick={generateShareLink}
                  disabled={sharing}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0D1321] px-4 py-2 text-sm font-bold text-[#F0EBD8] transition hover:bg-[#3E5C76] disabled:opacity-60"
                >
                  <Link2 className="h-4 w-4" />
                  {sharing ? 'Creating...' : 'Share vault'}
                </button>
              </div>
            </div>

            {shareMessage && (
              <div className="mb-4 rounded-2xl border border-[#748CAB]/30 bg-[#748CAB]/15 px-5 py-3 text-sm font-semibold text-[#1D2D44]">
                {shareMessage}
              </div>
            )}

            <div className="overflow-hidden rounded-[1.5rem] border border-[#0D1321]/10 bg-white">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_80px] border-b border-[#0D1321]/10 bg-[#F7F2DF] px-5 py-3 text-sm font-bold text-[#3E5C76]">
                <p>Document</p>
                <p>Category</p>
                <p>Uploaded</p>
                <p>Status</p>
                <p className="text-right">Actions</p>
              </div>

              {filteredDocs.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-[#3E5C76]" />

                  <p className="font-bold">No documents yet</p>

                  <p className="mt-1 text-sm text-[#3E5C76]">
                    Choose a category and upload your first file.
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedId(doc.id)
                      setActiveTab('Overview')
                      setShowDocPanel(true)
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      setSelectedId(doc.id)
                      setActiveTab('Overview')
                      setShowDocPanel(true)
                    }}
                    role="button"
                    tabIndex={0}
                    className={`grid w-full cursor-pointer grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_80px] items-center border-b border-[#0D1321]/10 px-5 py-4 text-left text-sm last:border-b-0 transition hover:bg-[#748CAB]/10 ${
                      selectedId === doc.id && showDocPanel
                        ? 'bg-[#748CAB]/15'
                        : ''
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1D2D44] text-[#F0EBD8]">
                        <FileText className="h-4 w-4" />
                      </div>

                      <a
                        href={doc.s3Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="truncate font-bold text-[#0D1321] underline-offset-4 hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>

                    <p>
                      <span className="rounded-full bg-[#748CAB]/20 px-3 py-1 text-xs font-bold text-[#1D2D44]">
                        {doc.category}
                      </span>
                    </p>

                    <p className="text-[#3E5C76]">{doc.uploadedOn}</p>

                    <p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doc.status === 'Analyzed'
                            ? 'bg-[#748CAB]/25 text-[#1D2D44]'
                            : 'bg-[#F0EBD8] text-[#3E5C76]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </p>

                    <div className="flex justify-end">
                      {doc.canDelete && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteDoc(doc.id)
                          }}
                          className="rounded-full p-2 text-[#3E5C76] transition hover:bg-red-50 hover:text-red-700"
                          aria-label={`Delete ${doc.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {selectedDoc && (
          <aside className="border-l border-[#0D1321]/10 bg-white p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1D2D44] text-[#F0EBD8]">
                  <FileText className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black">
                    {selectedDoc.name}
                  </h2>

                  <p className="text-sm text-[#3E5C76]">
                    {selectedDoc.type} · {selectedDoc.size}
                  </p>
                </div>
              </div>

              {selectedDoc.canDelete && (
                <button
                  onClick={() => deleteDoc(selectedDoc.id)}
                  className="rounded-full p-2 text-[#3E5C76] hover:bg-[#F0EBD8] hover:text-[#0D1321]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 text-center text-sm font-bold">
              {(['Overview', 'Details', 'Preview'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-2 ${
                    activeTab === tab
                      ? 'bg-[#0D1321] text-[#F0EBD8]'
                      : 'bg-[#F0EBD8] text-[#3E5C76]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Overview' && (
              <>
                <div className="mb-6 rounded-[1.5rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#3E5C76]" />
                    <p className="font-black">AI Summary</p>
                  </div>

                  <p className="text-sm leading-6 text-[#3E5C76]">
                    {selectedDoc.summary}
                  </p>
                </div>

                <div className="mb-6 rounded-[1.5rem] border border-[#748CAB]/30 bg-[#748CAB]/15 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#3E5C76]" />
                    <p className="font-black">Action Needed</p>
                  </div>

                  <div className="space-y-2">
                    {selectedDoc.nextSteps.map((step) => (
                      <p
                        key={step}
                        className="flex items-start gap-2 text-sm text-[#1D2D44]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3E5C76]" />
                        {step}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mb-6 rounded-[1.5rem] border border-[#0D1321]/10 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#3E5C76]" />
                    <p className="font-black">AI Suggestions</p>
                  </div>

                  <div className="grid gap-2">
                    {selectedDoc.related.map((item) => (
                      <button
                        key={item}
                        className="flex items-center justify-between rounded-2xl bg-[#F0EBD8] px-4 py-3 text-left text-sm font-semibold text-[#3E5C76] transition hover:bg-[#748CAB]/20 hover:text-[#0D1321]"
                      >
                        Add {item}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Details' && (
              <>
                <div className="mb-6 space-y-3">
                  {selectedDoc.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#0D1321]/10 bg-white px-4 py-3"
                    >
                      <p className="text-sm font-bold text-[#3E5C76]">
                        {detail.label}
                      </p>

                      <p className="text-right text-sm font-semibold text-[#0D1321]">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.5rem] bg-[#0D1321] p-5 text-[#F0EBD8]">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-[#748CAB]" />
                    <p className="font-black">Access</p>
                  </div>

                  <div
                    className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${visibilityStyle(
                      selectedDoc.visibility,
                    )}`}
                  >
                    <Lock className="h-3 w-3" />
                    {selectedDoc.visibility}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['Private', 'Family', 'Emergency'] as Visibility[]).map(
                      (visibility) => (
                        <button
                          key={visibility}
                          onClick={() => updateVisibility(visibility)}
                          className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                            selectedDoc.visibility === visibility
                              ? 'bg-[#F0EBD8] text-[#0D1321]'
                              : 'bg-[#F0EBD8]/10 text-[#F0EBD8]/60 hover:bg-[#F0EBD8]/20'
                          }`}
                        >
                          {visibility}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Preview' && (
              <div className="rounded-[1.5rem] border border-[#0D1321]/10 bg-[#F0EBD8] p-4">
                {selectedDoc.s3Url && selectedDoc.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedDoc.s3Url}
                    alt={selectedDoc.name}
                    className="max-h-[520px] w-full rounded-2xl object-contain"
                  />
                ) : selectedDoc.s3Url && selectedDoc.mimeType.includes('pdf') ? (
                  <iframe
                    src={selectedDoc.s3Url}
                    title={selectedDoc.name}
                    className="h-[520px] w-full rounded-2xl bg-white"
                  />
                ) : selectedDoc.dataUrl &&
                  selectedDoc.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedDoc.dataUrl}
                    alt={selectedDoc.name}
                    className="max-h-[520px] w-full rounded-2xl object-contain"
                  />
                ) : selectedDoc.dataUrl && selectedDoc.mimeType.includes('pdf') ? (
                  <iframe
                    src={selectedDoc.dataUrl}
                    title={selectedDoc.name}
                    className="h-[520px] w-full rounded-2xl bg-white"
                  />
                ) : selectedDoc.s3Url ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <FileText className="mb-4 h-12 w-12 text-[#3E5C76]" />

                    <h3 className="text-xl font-black">Open file</h3>

                    <a
                      href={selectedDoc.s3Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 rounded-full bg-[#0D1321] px-6 py-3 text-sm font-bold text-[#F0EBD8] hover:bg-[#3E5C76]"
                    >
                      View File
                    </a>
                  </div>
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <FileText className="mb-4 h-12 w-12 text-[#3E5C76]" />

                    <h3 className="text-xl font-black">Preview unavailable</h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#3E5C76]">
                      Preview is available for uploaded images and PDFs.
                    </p>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}
      </div>

      <AgentChat context="upload" />
    </main>
  )
}
