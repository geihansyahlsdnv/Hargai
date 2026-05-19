"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  Eye,
  Trash2,
  BarChart3,
  X,
  Tag,
  AlertTriangle,
  Camera,
  Clock,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────────

type WastePrice = {
  id: string
  name: string
  category: string
  unit: string
  current_price: number | string | null
  currency: string
}

type DetectionItem = {
  label: string
  confidence: number
  bbox: { x1: number; y1: number; x2: number; y2: number }
  price?: WastePrice | null
}

type AuditItem = {
  audit_id: number | string
  image_url: string
  preview_image?: string
  detections: DetectionItem[]
  top_label: string
  top_prediction?: string
  total_detections?: number
  average_confidence?: number
  estimated_price?: number
  created_at: string
}

// ── Delete Confirmation Dialog ────────────────────────────────────────────────

function DeleteDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-rose-600" />
        <div className="p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-center text-xl font-serif font-bold text-gray-900 mb-2">
            Hapus Sesi Deteksi?
          </h3>
          <p className="text-center text-sm text-gray-500 font-sans leading-relaxed">
            Seluruh data deteksi pada sesi ini akan dihapus secara permanen dan tidak bisa dikembalikan.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ya, Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const normalizeConfidence = (value: unknown): number => {
  const n = Number(value)
  if (Number.isNaN(n)) return 0
  return n > 1 ? n / 100 : n
}

const formatCurrency = (value: number | string | null | undefined, currency = "IDR") => {
  const n = Number(value)
  if (value === null || value === undefined || Number.isNaN(n)) return "Harga belum tersedia"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

function normalizeHistoryItem(item: any): AuditItem {
  const detections: DetectionItem[] = Array.isArray(item?.detections)
    ? item.detections.map((det: any) => ({
        label: String(det?.label ?? det?.class_name ?? det?.name ?? "Tidak diketahui"),
        confidence: normalizeConfidence(det?.confidence ?? det?.score ?? det?.conf ?? 0),
        bbox: {
          x1: Number(det?.bbox?.x1 ?? det?.x1 ?? 0),
          y1: Number(det?.bbox?.y1 ?? det?.y1 ?? 0),
          x2: Number(det?.bbox?.x2 ?? det?.x2 ?? 0),
          y2: Number(det?.bbox?.y2 ?? det?.y2 ?? 0),
        },
        price: det?.price ?? null,
      }))
    : []

  const topLabel = String(
    item?.top_label ?? item?.top_prediction ?? item?.prediction ?? detections[0]?.label ?? "Tidak diketahui"
  )

  const estimatedPrice = detections.reduce((sum, det) => {
    const p = Number(det?.price?.current_price)
    return sum + (Number.isNaN(p) ? 0 : p)
  }, 0)

  return {
    audit_id: item?.audit_id ?? item?.id ?? "-",
    image_url: String(item?.image_url ?? item?.imageUrl ?? ""),
    preview_image: String(item?.preview_image ?? item?.previewImage ?? ""),
    detections,
    top_label: topLabel,
    top_prediction: topLabel,
    total_detections: Number(item?.total_detections ?? detections.length ?? 0),
    average_confidence: normalizeConfidence(item?.average_confidence ?? item?.confidence ?? 0),
    estimated_price:
      estimatedPrice > 0
        ? estimatedPrice
        : typeof item?.estimated_price === "number"
        ? item.estimated_price
        : undefined,
    created_at: String(item?.created_at ?? item?.createdAt ?? new Date().toISOString()),
  }
}

function getAverageConfidence(audit: AuditItem): string {
  if (typeof audit.average_confidence === "number" && audit.average_confidence > 0) {
    return (audit.average_confidence * 100).toFixed(1)
  }
  if (!audit.detections.length) return "0.0"
  const avg =
    audit.detections.reduce((sum, d) => sum + Number(d.confidence || 0), 0) /
    audit.detections.length
  return (avg * 100).toFixed(1)
}

function getTotalDetections(audit: AuditItem): number {
  return Number(audit.total_detections ?? audit.detections.length ?? 0)
}

function getDisplayDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getDisplayImage(audit: AuditItem): string {
  return audit.preview_image || audit.image_url || ""
}

function getEstimatedPrice(audit: AuditItem): number {
  if (typeof audit.estimated_price === "number" && audit.estimated_price > 0) {
    return audit.estimated_price
  }
  return audit.detections.reduce((sum, det) => {
    const p = Number(det?.price?.current_price)
    return sum + (Number.isNaN(p) ? 0 : p)
  }, 0)
}

// Ambil label-label unik dari detections dalam satu sesi
function getUniqueLabels(audit: AuditItem): string[] {
  const seen = new Set<string>()
  return audit.detections
    .map((d) => d.label)
    .filter((l) => {
      if (seen.has(l)) return false
      seen.add(l)
      return true
    })
}

// ── Session Card ──────────────────────────────────────────────────────────────
// Merepresentasikan SATU sesi pengambilan gambar

function SessionCard({
  audit,
  deletingId,
  onDetail,
  onDelete,
}: {
  audit: AuditItem
  deletingId: string | null
  onDetail: (audit: AuditItem) => void
  onDelete: (id: number | string) => void
}) {
  const image = getDisplayImage(audit)
  const totalDetections = getTotalDetections(audit)
  const avgConf = getAverageConfidence(audit)
  const estimatedPrice = getEstimatedPrice(audit)
  const uniqueLabels = getUniqueLabels(audit)
  const isDeleting = deletingId === String(audit.audit_id)

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Thumbnail gambar sesi */}
          <div className="lg:col-span-3 bg-gray-900">
            <div className="h-52 lg:h-full min-h-[200px] flex items-center justify-center overflow-hidden relative">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Foto sesi deteksi"
                    className="w-full h-full object-contain"
                  />
                  {/* Badge jumlah objek di atas foto */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1.5">
                    <Camera className="h-3.5 w-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">
                      {totalDetections} objek
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-600 gap-2">
                  <Camera className="h-10 w-10" />
                  <p className="text-xs">Tidak ada gambar</p>
                </div>
              )}
            </div>
          </div>

          {/* Info sesi */}
          <div className="lg:col-span-6 p-6 space-y-4">
            {/* Waktu sesi */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{getDisplayDate(audit.created_at)}</span>
            </div>

            {/* Label-label objek yang terdeteksi dalam sesi ini */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Objek terdeteksi dalam foto ini</p>
              <div className="flex flex-wrap gap-2">
                {uniqueLabels.length > 0 ? (
                  uniqueLabels.map((label) => {
                    const count = audit.detections.filter((d) => d.label === label).length
                    return (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs font-semibold"
                      >
                        {label}
                        {count > 1 && (
                          <span className="ml-0.5 rounded-full bg-cyan-200 text-cyan-900 text-[10px] px-1.5 font-bold">
                            ×{count}
                          </span>
                        )}
                      </span>
                    )
                  })
                ) : (
                  <span className="text-xs text-gray-400 italic">Tidak ada objek terdeteksi</span>
                )}
              </div>
            </div>

            {/* Ringkasan numerik */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-gray-400 text-xs mb-0.5">Total Objek</p>
                <p className="font-bold text-gray-900 text-lg">{totalDetections}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-gray-400 text-xs mb-0.5">Avg. Confidence</p>
                <p className="font-bold text-cyan-600 text-lg">{avgConf}%</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <Tag className="h-3 w-3 text-green-600" />
                  <p className="text-gray-400 text-xs">Est. Harga</p>
                </div>
                <p className="font-bold text-green-700 text-sm leading-tight">
                  {formatCurrency(estimatedPrice > 0 ? estimatedPrice : null)}
                </p>
              </div>
            </div>
          </div>

          {/* Aksi */}
          <div className="lg:col-span-3 p-5 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex lg:flex-col gap-3 items-end justify-end lg:justify-center">
            <Button
              onClick={() => onDetail(audit)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1 lg:flex-none lg:w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
              <ChevronRight className="h-4 w-4 ml-1 opacity-60" />
            </Button>
            <Button
              onClick={() => onDelete(audit.audit_id)}
              disabled={isDeleting}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 flex-1 lg:flex-none lg:w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({
  audit,
  onClose,
}: {
  audit: AuditItem
  onClose: () => void
}) {
  const image = getDisplayImage(audit)
  const totalDetections = getTotalDetections(audit)
  const avgConf = getAverageConfidence(audit)
  const estimatedPrice = getEstimatedPrice(audit)

  // Kelompokkan detections per label
  const groupedByLabel = useMemo(() => {
    const map: Record<string, DetectionItem[]> = {}
    for (const det of audit.detections) {
      if (!map[det.label]) map[det.label] = []
      map[det.label].push(det)
    }
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [audit])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">Detail Sesi Deteksi</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              ID: {audit.audit_id} · {getDisplayDate(audit.created_at)}
            </p>
          </div>
          <Button onClick={onClose} variant="outline" size="sm" className="rounded-xl">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Kolom kiri — Foto */}
          <div className="bg-gray-900 lg:min-h-[500px] flex items-center justify-center p-4">
            {image ? (
              <img
                src={image}
                alt="Foto sesi deteksi"
                className="w-full max-h-[520px] object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600 gap-3 py-20">
                <Camera className="h-14 w-14 opacity-40" />
                <p className="text-sm">Tidak ada gambar</p>
              </div>
            )}
          </div>

          {/* Kolom kanan — Info */}
          <div className="p-6 space-y-5 overflow-auto">
            {/* Ringkasan sesi */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Ringkasan Sesi
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-cyan-50 p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Objek</p>
                  <p className="text-3xl font-serif font-bold text-cyan-700">{totalDetections}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-gray-500 mb-1">Avg. Confidence</p>
                  <p className="text-3xl font-serif font-bold text-amber-700">{avgConf}%</p>
                </div>
                <div className="col-span-2 rounded-xl bg-green-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-gray-500">Total Estimasi Harga</p>
                  </div>
                  <p className="text-2xl font-serif font-bold text-green-700">
                    {formatCurrency(estimatedPrice > 0 ? estimatedPrice : null)}
                  </p>
                </div>
              </div>
            </div>

            {/* Daftar objek yang terdeteksi, dikelompokkan per label */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Objek Terdeteksi ({totalDetections})
              </p>

              {groupedByLabel.length > 0 ? (
                <div className="space-y-3">
                  {groupedByLabel.map(([label, items]) => (
                    <div key={label} className="rounded-xl border border-gray-100 overflow-hidden">
                      {/* Label header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <span className="font-serif font-bold text-gray-900 text-sm">{label}</span>
                        <Badge className="bg-cyan-100 text-cyan-800 text-xs">
                          {items.length}× ditemukan
                        </Badge>
                      </div>

                      {/* Per-instance detail */}
                      <div className="divide-y divide-gray-50">
                        {items.map((det, idx) => (
                          <div key={idx} className="px-4 py-3 flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-400">Objek #{idx + 1}</span>
                                <span className="text-xs font-semibold text-cyan-600">
                                  Conf: {(det.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              {det.bbox.x2 > 0 && (
                                <p className="text-xs text-gray-400 font-mono">
                                  BBox: ({det.bbox.x1}, {det.bbox.y1}) – ({det.bbox.x2}, {det.bbox.y2})
                                </p>
                              )}
                              {det.price ? (
                                <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2 py-1">
                                  <Tag className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">
                                    {formatCurrency(det.price.current_price, det.price.currency)}
                                    {det.price.unit ? ` / ${det.price.unit}` : ""}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">Harga belum tersedia</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Tidak ada objek terdeteksi pada sesi ini.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DetectionHistoryPage() {
  const [auditHistory, setAuditHistory] = useState<AuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedAudit, setSelectedAudit] = useState<AuditItem | null>(null)

  const loadHistory = async () => {
    setLoading(true)
    try {
      localStorage.removeItem("saved_audit_history")
      const token = localStorage.getItem("access_token")
      const res = await fetch("/api/history", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })
      if (!res.ok) { setAuditHistory([]); return }
      const data = await res.json()
      setAuditHistory(
        Array.isArray(data) ? data.map((item: any) => normalizeHistoryItem(item)) : []
      )
    } catch (error) {
      console.error("Gagal memuat riwayat:", error)
      setAuditHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadHistory() }, [])

  // Kategori unik = kumpulan semua label dari semua sesi
  const categories = useMemo(() => {
    const cats = new Set<string>(["all"])
    auditHistory.forEach((item) =>
      item.detections.forEach((d) => cats.add(d.label))
    )
    return Array.from(cats)
  }, [auditHistory])

  const filteredAndSorted = useMemo(() => {
    const keyword = searchTerm.toLowerCase()
    const filtered = auditHistory.filter((item) => {
      const labels = item.detections.map((d) => d.label.toLowerCase()).join(" ")
      const date = getDisplayDate(item.created_at).toLowerCase()
      const matchesSearch = labels.includes(keyword) || date.includes(keyword)
      const matchesCategory =
        selectedCategory === "all" ||
        item.detections.some((d) => d.label === selectedCategory)
      return matchesSearch && matchesCategory
    })

    if (sortBy === "newest")
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortBy === "oldest")
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    else if (sortBy === "objects")
      filtered.sort((a, b) => getTotalDetections(b) - getTotalDetections(a))
    else if (sortBy === "confidence")
      filtered.sort((a, b) => Number(getAverageConfidence(b)) - Number(getAverageConfidence(a)))
    else if (sortBy === "price")
      filtered.sort((a, b) => getEstimatedPrice(b) - getEstimatedPrice(a))

    return filtered
  }, [auditHistory, searchTerm, selectedCategory, sortBy])

  const stats = useMemo(() => {
    const totalSessions = auditHistory.length
    const totalObjects = auditHistory.reduce((sum, a) => sum + getTotalDetections(a), 0)
    const averageConfidence = totalSessions
      ? (auditHistory.reduce((sum, a) => sum + Number(getAverageConfidence(a)), 0) / totalSessions).toFixed(1)
      : "0.0"
    const totalEstimatedPrice = auditHistory.reduce((sum, a) => sum + getEstimatedPrice(a), 0)
    return { totalSessions, totalObjects, averageConfidence, totalEstimatedPrice }
  }, [auditHistory])

  const handleOpenDetail = async (audit: AuditItem) => {
    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch(`/api/history/${audit.audit_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })
      setSelectedAudit(res.ok ? normalizeHistoryItem(await res.json()) : audit)
    } catch {
      setSelectedAudit(audit)
    }
  }

  const handleDeleteAudit = (auditId: number | string) => setDeleteTarget(String(auditId))

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget
    setDeleteTarget(null)
    const previousHistory = auditHistory
    setDeletingId(id)
    setAuditHistory((cur) => cur.filter((item) => String(item.audit_id) !== id))
    if (selectedAudit && String(selectedAudit.audit_id) === id) setSelectedAudit(null)

    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) { setAuditHistory(previousHistory); return }
      await loadHistory()
    } catch {
      setAuditHistory(previousHistory)
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(filteredAndSorted, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `riwayat-deteksi-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <DeleteDialog
        open={!!deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-4">
            Riwayat <span className="text-cyan-600">Deteksi</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
            Setiap entri merupakan satu sesi pengambilan foto beserta seluruh objek yang terdeteksi di dalamnya.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari berdasarkan jenis objek atau tanggal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-gray-50 border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-sans bg-white"
            >
              <option value="all">Semua Jenis Objek</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-sans bg-white"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="objects">Objek Terbanyak</option>
              <option value="confidence">Confidence Tertinggi</option>
              <option value="price">Estimasi Harga Tertinggi</option>
            </select>

            <Button
              onClick={handleExportData}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </section>

      {/* List sesi */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-5">
            {loading ? (
              <p className="text-gray-500 text-sm">Memuat data riwayat...</p>
            ) : (
              <p className="text-gray-500 text-sm">
                Menampilkan{" "}
                <span className="font-bold text-gray-900">{filteredAndSorted.length}</span>{" "}
                dari{" "}
                <span className="font-bold text-gray-900">{auditHistory.length}</span>{" "}
                sesi deteksi
              </p>
            )}
          </div>

          <div className="space-y-5">
            {loading ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center text-gray-400">
                  Memuat data sesi...
                </CardContent>
              </Card>
            ) : filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((audit) => (
                <SessionCard
                  key={audit.audit_id}
                  audit={audit}
                  deletingId={deletingId}
                  onDetail={handleOpenDetail}
                  onDelete={handleDeleteAudit}
                />
              ))
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Camera className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Belum ada sesi deteksi yang tersimpan.</p>
                  <Link href="/classify">
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      Mulai Deteksi
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Statistik ringkasan */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 pb-5 px-6">
              <p className="text-gray-500 text-sm mb-2">Total Sesi</p>
              <p className="text-4xl font-serif font-bold text-cyan-600">{stats.totalSessions}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 pb-5 px-6">
              <p className="text-gray-500 text-sm mb-2">Total Objek</p>
              <p className="text-4xl font-serif font-bold text-violet-600">{stats.totalObjects}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 pb-5 px-6">
              <p className="text-gray-500 text-sm mb-2">Rata-rata Confidence</p>
              <p className="text-4xl font-serif font-bold text-amber-600">{stats.averageConfidence}%</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6 pb-5 px-6">
              <p className="text-gray-500 text-sm mb-2">Total Estimasi Harga</p>
              <p className="text-2xl font-serif font-bold text-emerald-600 leading-tight mt-1">
                {formatCurrency(stats.totalEstimatedPrice > 0 ? stats.totalEstimatedPrice : null)}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-14 w-14 text-cyan-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Laporan Analitik</h3>
              <p className="text-gray-600 font-sans mb-6">
                Visualisasi dan analisis data dari seluruh sesi deteksi.
              </p>
              <Link href="/reports">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  Buka Laporan
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Camera className="h-14 w-14 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Sesi Deteksi Baru</h3>
              <p className="text-gray-600 font-sans mb-6">
                Ambil foto baru untuk memulai sesi deteksi berikutnya.
              </p>
              <Link href="/classify">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Mulai Deteksi
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedAudit && (
        <DetailModal audit={selectedAudit} onClose={() => setSelectedAudit(null)} />
      )}

{/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">
                HargAI
              </h3>
              <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-2xl">
                HargAI adalah platform klasifikasi sampah berbasis AI yang membantu pengguna mengenali jenis sampah dan melihat estimasi harga secara cepat.
              </p>
            </div>

            <div className="md:text-right">
              <h4 className="text-lg font-serif font-bold mb-4">
                Mulai Menggunakan
              </h4>
              <p className="text-gray-400 font-sans text-sm mb-4">
                Daftar akun untuk mengakses fitur.
              </p>
              <Link href="/register">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold">
                  Sign Up / Register
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 font-sans text-sm text-center md:text-left">
              © 2026 HargAI. All rights reserved.
            </p>
            <p className="text-gray-500 font-sans text-xs text-center md:text-right">
              Powered by HargAI Waste Classification System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}