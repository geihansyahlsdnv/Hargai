"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, Trash2, BarChart3, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type DetectionItem = {
  label: string
  confidence: number
  bbox: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

type AuditItem = {
  audit_id: number | string
  image_url: string
  preview_image?: string
  detections: DetectionItem[]
  top_label: string
  top_prediction?: string
  created_at: string
}

function normalizeHistoryItem(item: any): AuditItem {
  const detections = Array.isArray(item?.detections)
    ? item.detections.map((det: any) => ({
        label: String(det?.label ?? det?.class_name ?? det?.name ?? "Tidak diketahui"),
        confidence: Number(det?.confidence ?? det?.score ?? det?.conf ?? 0),
        bbox: {
          x1: Number(det?.bbox?.x1 ?? det?.x1 ?? 0),
          y1: Number(det?.bbox?.y1 ?? det?.y1 ?? 0),
          x2: Number(det?.bbox?.x2 ?? det?.x2 ?? 0),
          y2: Number(det?.bbox?.y2 ?? det?.y2 ?? 0),
        },
      }))
    : []

  const topLabel = String(
    item?.top_label ??
      item?.top_prediction ??
      item?.prediction ??
      detections[0]?.label ??
      "Tidak diketahui"
  )

  return {
    audit_id: item?.audit_id ?? item?.id ?? `local-${Date.now()}`,
    image_url: String(item?.image_url ?? item?.imageUrl ?? ""),
    preview_image: String(item?.preview_image ?? item?.previewImage ?? ""),
    detections,
    top_label: topLabel,
    top_prediction: topLabel,
    created_at: String(item?.created_at ?? item?.createdAt ?? new Date().toISOString()),
  }
}

function getAverageConfidence(audit: AuditItem): string {
  if (!audit.detections.length) return "0.0"

  const avg =
    audit.detections.reduce((sum, detection) => sum + Number(detection.confidence || 0), 0) /
    audit.detections.length

  return (avg * 100).toFixed(1)
}

function getDisplayDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleString("id-ID")
}

function getDisplayImage(audit: AuditItem): string {
  return audit.preview_image || audit.image_url || ""
}

export default function DetectionHistoryPage() {
  const [auditHistory, setAuditHistory] = useState<AuditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedAudit, setSelectedAudit] = useState<AuditItem | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // load local history first for instant render
        const rawLocal = localStorage.getItem("saved_audit_history")
        const localParsed = rawLocal ? JSON.parse(rawLocal) : []
        const localHistory: AuditItem[] = Array.isArray(localParsed)
          ? localParsed.map((item: any) => normalizeHistoryItem(item))
          : []
        setAuditHistory(localHistory)

        // then fetch from backend and merge
        const token = localStorage.getItem("access_token")
        if (!token) return

        const res = await fetch("/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) return

        const data = await res.json()
        const backendItems: AuditItem[] = Array.isArray(data)
          ? data.map((item: any) => normalizeHistoryItem(item))
          : []

        // merge: backend is source of truth, keep local-only items
        const backendIds = new Set(backendItems.map((i) => String(i.audit_id)))
        const localOnly = localHistory.filter(
          (i) => String(i.audit_id).startsWith("local-") || !backendIds.has(String(i.audit_id))
        )
        setAuditHistory([...backendItems, ...localOnly])
      } catch (error) {
        console.error("Gagal memuat riwayat:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>(["all"])

    auditHistory.forEach((item) => {
      if (item.top_label) {
        cats.add(item.top_label)
      }
    })

    return Array.from(cats)
  }, [auditHistory])

  const filteredAndSorted = useMemo(() => {
    const keyword = searchTerm.toLowerCase()

    const filtered = auditHistory.filter((item) => {
      const topLabel = item.top_label || ""
      const createdAt = item.created_at || ""

      const matchesSearch =
        topLabel.toLowerCase().includes(keyword) ||
        createdAt.includes(searchTerm) ||
        item.detections.some((d) => d.label.toLowerCase().includes(keyword))

      const matchesCategory = selectedCategory === "all" || topLabel === selectedCategory

      return matchesSearch && matchesCategory
    })

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === "confidence") {
      filtered.sort((a, b) => Number(getAverageConfidence(b)) - Number(getAverageConfidence(a)))
    }

    return filtered
  }, [auditHistory, searchTerm, selectedCategory, sortBy])

  const stats = useMemo(() => {
    const totalDetections = auditHistory.length
    const totalObjects = auditHistory.reduce((sum, audit) => sum + audit.detections.length, 0)

    const averageConfidence = totalDetections
      ? (
          auditHistory.reduce((sum, audit) => sum + Number(getAverageConfidence(audit)), 0) /
          totalDetections
        ).toFixed(1)
      : "0.0"

    return {
      totalDetections,
      averageConfidence,
      totalObjects,
    }
  }, [auditHistory])

  const handleDeleteAudit = (auditId: number | string) => {
    const nextHistory = auditHistory.filter(
      (item) => String(item.audit_id) !== String(auditId)
    )

    setAuditHistory(nextHistory)
    localStorage.setItem("saved_audit_history", JSON.stringify(nextHistory))

    if (selectedAudit && String(selectedAudit.audit_id) === String(auditId)) {
      setSelectedAudit(null)
    }
  }

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(auditHistory, null, 2)], {
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

      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
              Riwayat <span className="text-cyan-600">Deteksi</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Data yang sudah disimpan dari halaman audit akan muncul di sini.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan jenis sampah atau tanggal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-50 border-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-serif font-bold text-gray-900">
                  Kategori Sampah
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-sans"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Semua Kategori" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-serif font-bold text-gray-900">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-sans"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="confidence">Confidence Tertinggi</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleExportData}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-sans"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            {loading ? (
              <p className="text-gray-600 font-sans">Memuat data riwayat...</p>
            ) : (
              <p className="text-gray-600 font-sans">
                Menampilkan{" "}
                <span className="font-bold text-gray-900">
                  {filteredAndSorted.length}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-gray-900">
                  {auditHistory.length}
                </span>{" "}
                hasil deteksi
              </p>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 font-sans">Memuat data audit...</p>
                </CardContent>
              </Card>
            ) : filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((audit) => {
                const avgConfidence = getAverageConfidence(audit)
                const detectionDate = getDisplayDate(audit.created_at)
                const image = getDisplayImage(audit)

                return (
                  <Card
                    key={audit.audit_id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-span-3 bg-gray-100">
                          <div className="h-64 lg:h-full min-h-[220px] flex items-center justify-center overflow-hidden">
                            {image ? (
                              <img
                                src={image}
                                alt="Deteksi sampah"
                                className="w-full h-full object-contain bg-gray-900"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                <Trash2 className="h-12 w-12 mb-2" />
                                <p className="text-sm">Tidak ada gambar</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-6 p-6 space-y-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Prediksi Utama
                            </p>
                            <h3 className="text-2xl font-serif font-bold text-gray-900">
                              {audit.top_label}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {audit.detections.length > 0 ? (
                              audit.detections.map((det, index) => (
                                <Badge
                                  key={`${audit.audit_id}-${det.label}-${index}`}
                                  className="bg-cyan-100 text-cyan-800"
                                >
                                  {det.label}{" "}
                                  {(Number(det.confidence || 0) * 100).toFixed(1)}%
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">
                                Tidak ada detail deteksi
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-gray-500">Objek</p>
                              <p className="font-bold text-gray-900">
                                {audit.detections.length}
                              </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-gray-500">Confidence</p>
                              <p className="font-bold text-cyan-600">
                                {avgConfidence}%
                              </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-gray-500">Tanggal</p>
                              <p className="font-bold text-gray-900">
                                {detectionDate}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-3 p-6 bg-white border-t lg:border-t-0 lg:border-l flex lg:flex-col gap-3 justify-end">
                          <Button
                            onClick={() => setSelectedAudit(audit)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1 lg:flex-none"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </Button>

                          <Button
                            onClick={() => handleDeleteAudit(audit.audit_id)}
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50 flex-1 lg:flex-none"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-sans mb-4">
                    Belum ada riwayat deteksi yang tersimpan.
                  </p>
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

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm font-sans mb-2">
                  Total Audit
                </p>
                <p className="text-4xl font-serif font-bold text-cyan-600">
                  {stats.totalDetections}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm font-sans mb-2">
                  Rata-rata Confidence
                </p>
                <p className="text-4xl font-serif font-bold text-amber-600">
                  {stats.averageConfidence}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm font-sans mb-2">
                  Total Objek Terdeteksi
                </p>
                <p className="text-4xl font-serif font-bold text-green-600">
                  {stats.totalObjects}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-4">
              Kelola Data Lebih Lanjut
            </h2>
            <p className="text-gray-600 font-sans max-w-2xl mx-auto">
              Akses laporan analitik atau buat deteksi baru untuk melengkapi dataset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Laporan Analitik
                </h3>
                <p className="text-gray-600 font-sans mb-6">
                  Lihat laporan statistik dan visualisasi data trend deteksi sampah.
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
                <Trash2 className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Buat Deteksi Baru
                </h3>
                <p className="text-gray-600 font-sans mb-6">
                  Lakukan deteksi sampah baru menggunakan kamera atau upload gambar.
                </p>
                <Link href="/classify">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Mulai Deteksi
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {selectedAudit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  Detail Deteksi
                </h2>
                <p className="text-sm text-gray-500">
                  Audit ID: {selectedAudit.audit_id}
                </p>
              </div>

              <Button
                onClick={() => setSelectedAudit(null)}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="rounded-xl bg-gray-900 overflow-hidden">
                {getDisplayImage(selectedAudit) ? (
                  <img
                    src={getDisplayImage(selectedAudit)}
                    alt="Detail deteksi"
                    className="w-full max-h-[520px] object-contain"
                  />
                ) : (
                  <div className="h-[420px] flex items-center justify-center text-gray-400">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-cyan-50 p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Prediksi Utama
                    </p>
                    <p className="text-2xl font-serif font-bold text-cyan-700">
                      {selectedAudit.top_label}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm text-gray-600 mb-1">Confidence</p>
                    <p className="text-2xl font-serif font-bold text-amber-700">
                      {getAverageConfidence(selectedAudit)}%
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-600 mb-1">Waktu Deteksi</p>
                  <p className="font-bold text-gray-900">
                    {getDisplayDate(selectedAudit.created_at)}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-gray-900">
                    Detail Objek
                  </h3>

                  {selectedAudit.detections.length > 0 ? (
                    selectedAudit.detections.map((det, index) => (
                      <div
                        key={`${det.label}-${index}`}
                        className="rounded-xl border bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-gray-900">
                              {det.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              Confidence:{" "}
                              {(Number(det.confidence || 0) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-500">
                              BBox: ({det.bbox.x1}, {det.bbox.y1}) - (
                              {det.bbox.x2}, {det.bbox.y2})
                            </p>
                          </div>

                          <Badge className="bg-cyan-100 text-cyan-800">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tidak ada detail objek dari backend.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-sans text-sm">
            © 2024 HargAI - Sistem Deteksi Sampah Berbasis AI.
          </p>
        </div>
      </footer>
    </div>
  )
}