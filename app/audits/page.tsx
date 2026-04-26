"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Save, CheckCircle, History } from "lucide-react"
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

type DetectWasteResponse = {
  audit_id: number | string
  image_url: string
  preview_image?: string
  detections: DetectionItem[]
  top_prediction: string
  top_label?: string
  created_at: string
}

function normalizeAuditData(rawData: unknown): DetectWasteResponse | null {
  if (!rawData || typeof rawData !== "object") {
    return null
  }

  const data = rawData as Record<string, any>

  const rawDetections = Array.isArray(data.detections)
    ? data.detections
    : Array.isArray(data.results)
      ? data.results
      : Array.isArray(data.predictions)
        ? data.predictions
        : []

  const detections: DetectionItem[] = rawDetections.map((item: any) => ({
    label: String(
      item?.label ??
        item?.class ??
        item?.class_name ??
        item?.name ??
        item?.category ??
        "Tidak diketahui"
    ),
    confidence: Number(
      item?.confidence ??
        item?.score ??
        item?.conf ??
        item?.probability ??
        0
    ),
    bbox: {
      x1: Number(item?.bbox?.x1 ?? item?.bbox?.xmin ?? item?.x1 ?? item?.xmin ?? 0),
      y1: Number(item?.bbox?.y1 ?? item?.bbox?.ymin ?? item?.y1 ?? item?.ymin ?? 0),
      x2: Number(item?.bbox?.x2 ?? item?.bbox?.xmax ?? item?.x2 ?? item?.xmax ?? 0),
      y2: Number(item?.bbox?.y2 ?? item?.bbox?.ymax ?? item?.y2 ?? item?.ymax ?? 0),
    },
  }))

  const topPrediction = String(
    data.top_prediction ??
      data.top_label ??
      data.prediction ??
      data.label ??
      detections[0]?.label ??
      "Tidak diketahui"
  )

  return {
    audit_id: data.audit_id ?? data.auditId ?? data.id ?? `local-${Date.now()}`,
    image_url: String(data.image_url ?? data.imageUrl ?? data.image ?? data.url ?? ""),
    preview_image: String(data.preview_image ?? data.previewImage ?? ""),
    detections,
    top_prediction: topPrediction,
    top_label: topPrediction,
    created_at: String(
      data.created_at ??
        data.createdAt ??
        data.timestamp ??
        new Date().toISOString()
    ),
  }
}

function getSavedHistory(): DetectWasteResponse[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem("saved_audit_history")
    if (!raw) return []

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function AuditPage() {
  const [latestAudit, setLatestAudit] = useState<DetectWasteResponse | null>(null)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMounted(true)

    const raw = sessionStorage.getItem("latest_detection_result")
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      const normalized = normalizeAuditData(parsed)

      setLatestAudit(normalized)
    } catch (error) {
      console.error("Gagal membaca hasil deteksi terbaru:", error)
      setLatestAudit(null)
    }
  }, [])

  const detections = latestAudit?.detections ?? []
  const displayImage = latestAudit?.preview_image || latestAudit?.image_url || ""

  const avgConfidence = useMemo(() => {
    if (detections.length === 0) return 0

    const totalConfidence = detections.reduce((sum, item) => {
      return sum + Number(item.confidence || 0)
    }, 0)

    return totalConfidence / detections.length
  }, [detections])

  const formattedCreatedAt = useMemo(() => {
    if (!mounted || !latestAudit?.created_at) return "-"

    const date = new Date(latestAudit.created_at)

    if (Number.isNaN(date.getTime())) {
      return "-"
    }

    return date.toLocaleString("id-ID")
  }, [mounted, latestAudit?.created_at])

  const handleSaveToHistory = () => {
    if (!latestAudit) return

    const history = getSavedHistory()

    const itemToSave: DetectWasteResponse = {
      ...latestAudit,
      audit_id:
        latestAudit.audit_id && latestAudit.audit_id !== "-"
          ? latestAudit.audit_id
          : `local-${Date.now()}`,
      top_label: latestAudit.top_prediction,
      created_at: latestAudit.created_at || new Date().toISOString(),
      image_url: latestAudit.image_url || "",
      preview_image: "",
    }

    const alreadyExists = history.some(
      (item) => String(item.audit_id) === String(itemToSave.audit_id)
    )

    const nextHistory = alreadyExists
      ? history.map((item) =>
          String(item.audit_id) === String(itemToSave.audit_id)
            ? itemToSave
            : item
        )
      : [itemToSave, ...history]

    try {
      localStorage.setItem("saved_audit_history", JSON.stringify(nextHistory))
      setSaved(true)
    } catch (error) {
      console.error("Gagal menyimpan ke riwayat:", error)

      const compactHistory = nextHistory.slice(0, 20).map((item) => ({
        ...item,
        image_url: item.image_url?.startsWith("data:") ? "" : item.image_url,
        preview_image: "",
      }))

      localStorage.setItem("saved_audit_history", JSON.stringify(compactHistory))
      setSaved(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4">
            Audit <span className="text-cyan-600">Sampah</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Menampilkan hasil klasifikasi terbaru sebelum disimpan ke riwayat.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {latestAudit ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="border-b bg-gray-50/60">
                  <CardTitle className="text-xl font-serif font-bold text-gray-900">
                    Gambar Hasil Audit
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="bg-gray-100">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Hasil deteksi"
                        className="w-full h-[420px] object-contain"
                      />
                    ) : (
                      <div className="w-full h-[420px] flex items-center justify-center text-gray-400">
                        Tidak ada gambar
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader className="border-b bg-gray-50/60">
                  <CardTitle className="text-xl font-serif font-bold text-gray-900">
                    Ringkasan Audit
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border border-gray-200 bg-cyan-50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">Audit ID</p>
                        <p className="text-3xl font-serif font-bold text-cyan-600">
                          {latestAudit.audit_id}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 bg-amber-50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Prediksi Utama
                        </p>
                        <p className="text-2xl font-serif font-bold text-amber-600">
                          {latestAudit.top_prediction}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border border-gray-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Total Deteksi
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {detections.length}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Confidence Rata-rata
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {(avgConfidence * 100).toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-gray-900">
                      Detail Deteksi
                    </h3>

                    {detections.length > 0 ? (
                      detections.map((item, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              x1:{item.bbox.x1} y1:{item.bbox.y1} x2:
                              {item.bbox.x2} y2:{item.bbox.y2}
                            </p>
                          </div>

                          <Badge className="bg-cyan-100 text-cyan-800">
                            {(Number(item.confidence || 0) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 border rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">
                          Tidak ada detail deteksi dari backend.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 border-t pt-4">
                    <p>Dibuat pada: {formattedCreatedAt}</p>
                    <p>
                      Data ini belum masuk riwayat sebelum tombol simpan ditekan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleSaveToHistory}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {saved ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Tersimpan
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan ke Riwayat
                        </>
                      )}
                    </Button>

                    <Link href="/history">
                      <Button variant="outline" className="w-full">
                        <History className="h-4 w-4 mr-2" />
                        Lihat Riwayat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="pt-12 text-center pb-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Belum ada hasil deteksi terbaru
                </p>
                <p className="text-gray-400 text-sm">
                  Lakukan klasifikasi terlebih dahulu di halaman Klasifikasi.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}