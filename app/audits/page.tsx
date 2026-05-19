"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Image as ImageIcon,
  History,
  RotateCcw,
  Search,
  ArrowUpDown,
  CheckCircle,
  Tag,
} from "lucide-react"
import Link from "next/link"

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
  bbox: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  price?: WastePrice | null
}

type DetectWasteResponse = {
  audit_id: number | string
  image_url: string
  preview_image?: string
  detections: DetectionItem[]
  top_prediction: string
  top_label?: string
  created_at: string
  raw_response?: unknown
}

const normalizeConfidence = (value: unknown): number => {
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return 0
  if (numberValue > 1) return numberValue / 100
  return numberValue
}

const normalizeBBox = (item: any) => {
  const bbox =
    item?.bbox ||
    item?.box ||
    item?.bounding_box ||
    item?.boundingBox ||
    {}

  return {
    x1: Number(bbox?.x1 ?? bbox?.xmin ?? bbox?.left ?? item?.x1 ?? item?.xmin ?? 0),
    y1: Number(bbox?.y1 ?? bbox?.ymin ?? bbox?.top ?? item?.y1 ?? item?.ymin ?? 0),
    x2: Number(bbox?.x2 ?? bbox?.xmax ?? bbox?.right ?? item?.x2 ?? item?.xmax ?? 0),
    y2: Number(bbox?.y2 ?? bbox?.ymax ?? bbox?.bottom ?? item?.y2 ?? item?.ymax ?? 0),
  }
}

const getRawDetections = (result: any): any[] => {
  if (!result) return []

  const possibleArrays = [
    result.detections,
    result.results,
    result.predictions,
    result.objects,
    result.items,
    result.data?.detections,
    result.data?.results,
    result.data?.predictions,
    result.output?.detections,
    result.output?.results,
    result.output?.predictions,
  ]

  const foundArray = possibleArrays.find((value) => Array.isArray(value))
  return Array.isArray(foundArray) ? foundArray : []
}

const getLabelFromItem = (item: any, index: number): string => {
  return String(
    item?.label ??
      item?.class ??
      item?.class_name ??
      item?.className ??
      item?.name ??
      item?.category ??
      item?.prediction ??
      item?.predicted_class ??
      item?.predicted_label ??
      item?.cls ??
      item?.object ??
      item?.type ??
      `Objek ${index + 1}`
  )
}

const getConfidenceFromItem = (item: any): number => {
  return normalizeConfidence(
    item?.confidence ??
      item?.score ??
      item?.conf ??
      item?.probability ??
      item?.prob ??
      item?.accuracy ??
      0
  )
}

const getDetections = (result: any): DetectionItem[] => {
  if (!result) return []

  const rawDetections = getRawDetections(result)

  if (rawDetections.length > 0) {
    return rawDetections.map((item: any, index: number) => ({
      label: getLabelFromItem(item, index),
      confidence: getConfidenceFromItem(item),
      bbox: normalizeBBox(item),
      price: item?.price ?? null,
    }))
  }

  const singleLabel =
    result.top_prediction ??
    result.top_label ??
    result.prediction ??
    result.label ??
    result.class ??
    result.class_name ??
    result.predicted_class ??
    result.predicted_label ??
    result.result ??
    result.category ??
    result.data?.top_prediction ??
    result.data?.top_label ??
    result.data?.prediction ??
    result.data?.label ??
    result.output?.top_prediction ??
    result.output?.top_label ??
    result.output?.prediction ??
    result.output?.label

  if (!singleLabel) return []

  return [
    {
      label: String(singleLabel),
      confidence: normalizeConfidence(
        result.confidence ??
          result.score ??
          result.conf ??
          result.probability ??
          result.data?.confidence ??
          result.data?.score ??
          result.output?.confidence ??
          result.output?.score ??
          0
      ),
      bbox: { x1: 0, y1: 0, x2: 0, y2: 0 },
      price: null,
    },
  ]
}

const getImageUrl = (result: any): string => {
  return String(
    result?.image_url ??
      result?.imageUrl ??
      result?.image ??
      result?.url ??
      result?.file_url ??
      result?.fileUrl ??
      result?.data?.image_url ??
      result?.data?.imageUrl ??
      result?.data?.image ??
      result?.output?.image_url ??
      ""
  )
}

const formatCurrency = (
  value: number | string | null | undefined,
  currency = "IDR"
) => {
  const numberValue = Number(value)

  if (value === null || value === undefined || Number.isNaN(numberValue)) {
    return "Harga belum tersedia"
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numberValue)
}

function normalizeAuditData(rawData: unknown): DetectWasteResponse | null {
  if (!rawData || typeof rawData !== "object") return null

  const data = rawData as Record<string, any>
  const detections = getDetections(data)

  const topPrediction = String(
    data.top_prediction ??
      data.top_label ??
      data.prediction ??
      data.label ??
      data.class ??
      data.class_name ??
      data.predicted_class ??
      data.predicted_label ??
      data.result ??
      data.category ??
      data.data?.top_prediction ??
      data.data?.top_label ??
      data.data?.prediction ??
      data.data?.label ??
      data.output?.top_prediction ??
      data.output?.top_label ??
      data.output?.prediction ??
      data.output?.label ??
      detections[0]?.label ??
      "Tidak diketahui"
  )

  return {
    audit_id: data.audit_id ?? data.auditId ?? data.id ?? "-",
    image_url: getImageUrl(data),
    preview_image: String(data.preview_image ?? data.previewImage ?? ""),
    detections,
    top_prediction: topPrediction,
    top_label: topPrediction,
    created_at: String(
      data.created_at ??
        data.createdAt ??
        data.timestamp ??
        data.data?.created_at ??
        new Date().toISOString()
    ),
    raw_response: data.raw_response ?? data,
  }
}

export default function AuditPage() {
  const [latestAudit, setLatestAudit] = useState<DetectWasteResponse | null>(null)
  const [mounted, setMounted] = useState(false)
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"latest" | "confidence" | "label">("latest")

  useEffect(() => {
    setMounted(true)

    const raw = sessionStorage.getItem("latest_detection_result")
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      setLatestAudit(normalizeAuditData(parsed))
    } catch (error) {
      console.error("Gagal membaca hasil deteksi terbaru:", error)
      setLatestAudit(null)
    }
  }, [])

  const detections = latestAudit?.detections ?? []
  const displayImage = latestAudit?.preview_image || latestAudit?.image_url || ""

  const avgConfidence = useMemo(() => {
    if (detections.length === 0) return 0
    return detections.reduce((sum, item) => sum + item.confidence, 0) / detections.length
  }, [detections])

  const detectedPrices = useMemo(() => {
    return detections
      .map((item) => item.price)
      .filter((item): item is WastePrice => Boolean(item))
  }, [detections])

  const totalEstimatedPrice = useMemo(() => {
    return detectedPrices.reduce((total, item) => {
      const price = Number(item.current_price)
      return total + (Number.isNaN(price) ? 0 : price)
    }, 0)
  }, [detectedPrices])

  const categories = useMemo(() => {
    return Array.from(new Set(detections.map((item) => item.label)))
  }, [detections])

  const filteredDetections = useMemo(() => {
    let result = detections.filter((item) => {
      const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.label === categoryFilter
      return matchesSearch && matchesCategory
    })

    if (sortBy === "confidence") {
      result = [...result].sort((a, b) => b.confidence - a.confidence)
    }

    if (sortBy === "label") {
      result = [...result].sort((a, b) => a.label.localeCompare(b.label))
    }

    return result
  }, [detections, searchTerm, categoryFilter, sortBy])

  const formattedCreatedAt = useMemo(() => {
    if (!mounted || !latestAudit?.created_at) return "-"

    const date = new Date(latestAudit.created_at)
    if (Number.isNaN(date.getTime())) return "-"

    return date.toLocaleString("id-ID")
  }, [mounted, latestAudit?.created_at])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4">
            Audit <span className="text-cyan-600">Sampah</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Pusat pengelolaan hasil deteksi sampah yang otomatis tersimpan dari proses klasifikasi AI.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {latestAudit ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-slate-200 bg-white">
                    <CardTitle className="text-xl font-serif font-bold text-slate-950">
                      Preview Hasil Deteksi
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-950">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt="Hasil deteksi"
                          className="h-auto w-full"
                          onLoad={(event) => {
                            setImageNaturalSize({
                              width: event.currentTarget.naturalWidth,
                              height: event.currentTarget.naturalHeight,
                            })
                          }}
                        />
                      ) : (
                        <div className="w-full h-[420px] flex items-center justify-center text-slate-400">
                          Tidak ada gambar
                        </div>
                      )}

                      {detections.map((result, index) => {
                        const hasValidBox =
                          result.bbox.x2 > result.bbox.x1 &&
                          result.bbox.y2 > result.bbox.y1 &&
                          imageNaturalSize.width > 0 &&
                          imageNaturalSize.height > 0

                        if (!hasValidBox) return null

                        const isNormalizedBox = result.bbox.x2 <= 1 && result.bbox.y2 <= 1

                        const left = isNormalizedBox
                          ? result.bbox.x1 * 100
                          : (result.bbox.x1 / imageNaturalSize.width) * 100

                        const top = isNormalizedBox
                          ? result.bbox.y1 * 100
                          : (result.bbox.y1 / imageNaturalSize.height) * 100

                        const width = isNormalizedBox
                          ? (result.bbox.x2 - result.bbox.x1) * 100
                          : ((result.bbox.x2 - result.bbox.x1) / imageNaturalSize.width) * 100

                        const height = isNormalizedBox
                          ? (result.bbox.y2 - result.bbox.y1) * 100
                          : ((result.bbox.y2 - result.bbox.y1) / imageNaturalSize.height) * 100

                        return (
                          <div
                            key={`audit-bbox-${result.label}-${index}`}
                            className="pointer-events-none absolute rounded-lg border-2 border-cyan-400"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              width: `${width}%`,
                              height: `${height}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-0 whitespace-nowrap rounded-md bg-cyan-600 px-2 py-1 text-xs font-sans font-semibold text-white shadow-sm">
                              {result.label} • {(result.confidence * 100).toFixed(1)}%
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader className="border-b border-slate-200 bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-xl font-serif font-bold text-slate-950">
                        Hasil Klasifikasi AI
                      </CardTitle>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        Tersimpan
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-slate-200 bg-cyan-50 p-4">
                        <p className="text-sm text-slate-500">Audit ID</p>
                        <p className="mt-2 text-3xl font-serif font-black text-cyan-600">
                          {latestAudit.audit_id}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-amber-50 p-4">
                        <p className="text-sm text-slate-500">Kategori Sampah</p>
                        <p className="mt-2 text-2xl font-serif font-black text-amber-600">
                          {latestAudit.top_prediction}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Total Objek</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {detections.length}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Confidence Rata-rata</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {(avgConfidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="h-4 w-4 text-green-700" />
                        <p className="text-sm text-slate-500">Estimasi Harga</p>
                      </div>
                      <p className="text-2xl font-serif font-black text-green-700">
                        {formatCurrency(totalEstimatedPrice, "IDR")}
                      </p>
                    </div>

                    <div className="text-sm text-slate-500 border-t border-slate-200 pt-4">
                      <p>Waktu deteksi: {formattedCreatedAt}</p>
                      <p>Data audit sudah otomatis disimpan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/history">
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                          <History className="h-4 w-4 mr-2" />
                          Lihat Riwayat
                        </Button>
                      </Link>

                      <Link href="/classify">
                        <Button variant="outline" className="w-full">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Deteksi Baru
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-xl font-serif font-bold text-slate-950">
                    Tabel Data Audit
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Cari kategori sampah..."
                        className="pl-9"
                      />
                    </div>

                    <select
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                    >
                      <option value="all">Semua kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as "latest" | "confidence" | "label")
                      }
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                    >
                      <option value="latest">Urutan deteksi</option>
                      <option value="confidence">Confidence tertinggi</option>
                      <option value="label">Kategori A-Z</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">No</th>
                          <th className="px-4 py-3 text-left font-semibold">Jenis Sampah</th>
                          <th className="px-4 py-3 text-left font-semibold">
                            <span className="inline-flex items-center gap-1">
                              Confidence <ArrowUpDown className="h-3.5 w-3.5" />
                            </span>
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">Bounding Box</th>
                          <th className="px-4 py-3 text-left font-semibold">Harga</th>
                          <th className="px-4 py-3 text-left font-semibold">Waktu Deteksi</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {filteredDetections.length > 0 ? (
                          filteredDetections.map((item, index) => (
                            <tr key={`${item.label}-${index}`} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                {item.label}
                              </td>
                              <td className="px-4 py-3">
                                <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
                                  {(item.confidence * 100).toFixed(1)}%
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                x1:{item.bbox.x1} y1:{item.bbox.y1} x2:{item.bbox.x2} y2:
                                {item.bbox.y2}
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                {item.price
                                  ? formatCurrency(item.price.current_price, item.price.currency)
                                  : "Harga belum tersedia"}
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                {formattedCreatedAt}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              Tidak ada data deteksi yang cocok.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-2 border-dashed border-slate-300 bg-white">
              <CardContent className="pt-12 text-center pb-12">
                <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg mb-2">
                  Belum ada hasil deteksi terbaru
                </p>
                <p className="text-slate-400 text-sm">
                  Lakukan klasifikasi terlebih dahulu di halaman Klasifikasi.
                </p>

                <Link href="/classify" className="inline-block mt-6">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Deteksi Baru
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

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