"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Upload,
  AlertCircle,
  RefreshCw,
  X,
  Circle,
  Database,
  Tag,
  Play,
  Square,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

type WastePrice = {
  id: string
  name: string
  category: string
  unit: string
  current_price: number | string | null
  currency: string
}

type BackendDetection = {
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
  detections: BackendDetection[]
  top_prediction: string
  created_at: string
  raw_response?: unknown
}

const normalizeLabel = (value: string) => {
  return value.trim().toLowerCase().replace(/[_-]/g, " ")
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

const findWastePrice = (label: string, wasteTypes: WastePrice[]) => {
  const target = normalizeLabel(label)

  return (
    wasteTypes.find((item) => normalizeLabel(item.name) === target) ||
    wasteTypes.find((item) => target.includes(normalizeLabel(item.name))) ||
    wasteTypes.find((item) => normalizeLabel(item.name).includes(target)) ||
    null
  )
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

const getDetections = (
  result: any,
  wasteTypes: WastePrice[] = []
): BackendDetection[] => {
  if (!result) return []

  const rawDetections = getRawDetections(result)

  if (rawDetections.length > 0) {
    return rawDetections.map((item: any, index: number) => {
      const label = getLabelFromItem(item, index)

      return {
        label,
        confidence: getConfidenceFromItem(item),
        bbox: normalizeBBox(item),
        price: findWastePrice(label, wasteTypes),
      }
    })
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

  const label = String(singleLabel)

  return [
    {
      label,
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
      bbox: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      },
      price: findWastePrice(label, wasteTypes),
    },
  ]
}

const getTopPrediction = (result: any, wasteTypes: WastePrice[] = []): string => {
  if (!result) return "Tidak diketahui"

  const detections = getDetections(result, wasteTypes)

  return String(
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
      result.output?.label ??
      detections[0]?.label ??
      "Tidak diketahui"
  )
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

const normalizeDetectResponse = (
  result: any,
  wasteTypes: WastePrice[] = []
): DetectWasteResponse => {
  const detections = getDetections(result, wasteTypes)
  const topPrediction = getTopPrediction(result, wasteTypes)

  return {
    audit_id: result?.audit_id ?? result?.auditId ?? result?.id ?? `local-${Date.now()}`,
    image_url: getImageUrl(result),
    detections,
    top_prediction: topPrediction,
    created_at:
      result?.created_at ??
      result?.createdAt ??
      result?.timestamp ??
      result?.data?.created_at ??
      new Date().toISOString(),
    raw_response: result,
  }
}

export default function WasteDetectionPage() {
  const router = useRouter()

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectResult, setDetectResult] = useState<DetectWasteResponse | null>(null)
  const [wasteTypes, setWasteTypes] = useState<WastePrice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPriceLoading, setIsPriceLoading] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isLiveDetecting, setIsLiveDetecting] = useState(false)
  const [isLiveProcessing, setIsLiveProcessing] = useState(false)
  const [liveDetections, setLiveDetections] = useState<BackendDetection[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const [rawBackendResponse, setRawBackendResponse] = useState("")
  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 0,
    height: 0,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const liveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const liveProcessingRef = useRef(false)

  const detections = detectResult?.detections ?? []
  const topPrediction = detectResult?.top_prediction ?? "Tidak diketahui"

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

  useEffect(() => {
    const fetchWasteTypes = async () => {
      setIsPriceLoading(true)

      try {
        const { data } = await api.get("/waste-types")
        setWasteTypes(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Gagal mengambil data harga sampah:", error)
      } finally {
        setIsPriceLoading(false)
      }
    }

    fetchWasteTypes()
  }, [])

  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(console.error)
    }
  }, [isCameraOpen, stream])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current)
        liveIntervalRef.current = null
      }
    }
  }, [stream])

  const stopLiveDetection = () => {
    setIsLiveDetecting(false)
    setIsLiveProcessing(false)
    setLiveDetections([])
    liveProcessingRef.current = false

    if (liveIntervalRef.current) {
      clearInterval(liveIntervalRef.current)
      liveIntervalRef.current = null
    }
  }

  const handleOpenCamera = async () => {
    setCameraError(null)
    setPreviewImage(null)
    setSelectedFile(null)
    setDetectResult(null)
    setErrorMessage("")
    setDebugInfo("")
    setRawBackendResponse("")
    setImageNaturalSize({ width: 0, height: 0 })
    setLiveDetections([])

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(mediaStream)
      setIsCameraOpen(true)
    } catch (err: any) {
      setCameraError(err?.message || "Gagal membuka kamera.")
    }
  }

  const handleCloseCamera = () => {
    stopLiveDetection()

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsCameraOpen(false)
  }

  const runLiveDetection = async () => {
    if (liveProcessingRef.current) return
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.videoWidth === 0 || video.videoHeight === 0) return

    liveProcessingRef.current = true
    setIsLiveProcessing(true)

    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext("2d")
      if (!context) return

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.8)
      })

      if (!blob) return

      const file = new File([blob], `live-${Date.now()}.jpg`, {
        type: "image/jpeg",
      })

      const formData = new FormData()
      formData.append("file", file)

      const token =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null

      const { data } = await api.post("/detect?preview=true", formData, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      })
      const normalizedData = normalizeDetectResponse(data, wasteTypes)

      setLiveDetections(normalizedData.detections)
    } catch (error: any) {
      console.error("Live detection error:", error)
    } finally {
      liveProcessingRef.current = false
      setIsLiveProcessing(false)
    }
  }

  const handleStartLiveDetection = async () => {
    setErrorMessage("")
    setDebugInfo("")
    setDetectResult(null)
    setPreviewImage(null)
    setSelectedFile(null)
    setLiveDetections([])
    setIsLiveDetecting(true)

    await runLiveDetection()

    liveIntervalRef.current = setInterval(() => {
      runLiveDetection()
    }, 1500)
  }

  const detectWaste = async (file: File, preview: string) => {
    setIsLoading(true)
    setErrorMessage("")
    setDebugInfo("")
    setRawBackendResponse("")
    setPreviewImage(preview)
    setSelectedFile(file)
    setDetectResult(null)
    setImageNaturalSize({ width: 0, height: 0 })

    try {
      setDebugInfo(`File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file melebihi 5MB.")
        return
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png"]

      if (!validTypes.includes(file.type)) {
        setErrorMessage("Format file harus JPG, JPEG, atau PNG.")
        return
      }

      let latestWasteTypes = wasteTypes

      if (latestWasteTypes.length === 0) {
        try {
          const { data: wasteData } = await api.get("/waste-types")
          latestWasteTypes = Array.isArray(wasteData) ? wasteData : []
          setWasteTypes(latestWasteTypes)
        } catch (error) {
          console.error("Gagal mengambil data harga sebelum deteksi:", error)
        }
      }

      const formData = new FormData()
      formData.append("file", file)

      const { data } = await api.post("/detect", formData)

      const normalizedData = {
        ...normalizeDetectResponse(data, latestWasteTypes),
        preview_image: preview,
      }

      console.log("RAW BACKEND RESPONSE:", data)

      setRawBackendResponse(JSON.stringify(data, null, 2))
      setDetectResult(normalizedData)
      sessionStorage.setItem("latest_detection_result", JSON.stringify(normalizedData))

      setDebugInfo(
        `✓ Deteksi berhasil! Hasil: ${normalizedData.top_prediction}. Total deteksi: ${normalizedData.detections.length}`
      )
    } catch (error: any) {
      const status = error?.response?.status
      const errorData = error?.response?.data

      let message = "Gagal mendeteksi gambar."

      if (status === 413) {
        message = "Ukuran file melebihi 5MB."
      } else if (status === 415) {
        message = "Format file harus JPG, JPEG, atau PNG."
      } else if (status === 500) {
        message = "Terjadi kesalahan pada model AI."
      } else if (status === 401) {
        message = "Sesi login habis. Silakan login kembali."
      } else if (status === 503) {
        message = errorData?.message || errorData?.detail || "Backend deteksi sedang tidak bisa dijangkau."
      } else if (status === 400) {
        message = errorData?.message || errorData?.detail || "Request tidak valid."
      } else if (!status) {
        message = "Koneksi ke server gagal. Cek backend dan base URL."
      }

      setErrorMessage(message)
      setDebugInfo(`Error [${status || "Network"}]: ${error?.message || "Unknown error"}`)

      if (errorData) {
        setRawBackendResponse(JSON.stringify(errorData, null, 2))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setErrorMessage("Video atau canvas reference tidak tersedia.")
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("Video belum siap. Tunggu sebentar dan coba lagi.")
      return
    }

    try {
      stopLiveDetection()

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext("2d")

      if (!context) {
        setErrorMessage("Tidak dapat mengakses canvas context.")
        return
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.92)
      })

      if (!blob) {
        setErrorMessage("Gagal mengkonversi gambar.")
        return
      }

      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      })

      const preview = canvas.toDataURL("image/jpeg", 0.92)

      handleCloseCamera()
      await detectWaste(file, preview)
    } catch (err: any) {
      setErrorMessage(`Error saat capture: ${err.message}`)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = async (readerEvent) => {
      const preview = readerEvent.target?.result as string
      await detectWaste(file, preview)
    }

    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    stopLiveDetection()
    setPreviewImage(null)
    setSelectedFile(null)
    setDetectResult(null)
    setErrorMessage("")
    setDebugInfo("")
    setRawBackendResponse("")
    setImageNaturalSize({ width: 0, height: 0 })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
              Deteksi <span className="text-cyan-600">Sampah</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Gunakan kamera atau unggah gambar untuk mendeteksi jenis sampah,
              bounding box, confidence score, dan estimasi harga.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-gray-900">
                  Upload Gambar
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!isCameraOpen ? (
                  <button
                    onClick={handleOpenCamera}
                    className="w-full border-2 border-dashed border-cyan-600 rounded-lg p-6 hover:bg-cyan-50 transition-colors text-center"
                  >
                    <Camera className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                    <p className="font-serif font-bold text-gray-900 mb-1">
                      Ambil Foto
                    </p>
                    <p className="text-sm text-gray-600 font-sans">
                      Gunakan kamera perangkat
                    </p>
                  </button>
                ) : (
                  <button
                    onClick={handleCloseCamera}
                    className="w-full border-2 border-dashed border-red-600 rounded-lg p-6 hover:bg-red-50 transition-colors text-center"
                  >
                    <X className="h-8 w-8 text-red-600 mx-auto mb-3" />
                    <p className="font-serif font-bold text-gray-900 mb-1">
                      Tutup Kamera
                    </p>
                  </button>
                )}

                {!isCameraOpen && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-amber-600 rounded-lg p-6 hover:bg-amber-50 transition-colors text-center"
                  >
                    <Upload className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                    <p className="font-serif font-bold text-gray-900 mb-1">
                      Unggah Gambar
                    </p>
                    <p className="text-sm text-gray-600 font-sans">
                      JPG, JPEG, PNG maksimal 5MB
                    </p>
                  </button>
                )}

                {(previewImage || detectResult) && !isCameraOpen && (
                  <Button onClick={handleReset} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-amber-600" />
                  <p className="font-serif font-bold text-gray-900">
                    Data Harga Sampah
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {isPriceLoading
                    ? "Mengambil data harga..."
                    : `${wasteTypes.length} jenis sampah aktif tersedia.`}
                </p>
              </CardContent>
            </Card>

            {errorMessage ? (
              <Card className="border-0 shadow-lg bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-semibold">
                        {errorMessage}
                      </p>
                      {debugInfo ? (
                        <p className="text-xs text-red-600 mt-2 font-mono break-words">
                          {debugInfo}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {debugInfo && !errorMessage ? (
              <Card className="border-0 shadow-lg bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-800 font-mono break-words">
                    {debugInfo}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {selectedFile ? (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">File aktif:</p>
                  <p className="text-sm font-mono text-gray-900 break-words">
                    {selectedFile.name}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {isCameraOpen ? (
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-serif font-bold text-white">
                      Kamera Live
                    </CardTitle>
                    {isLiveDetecting ? (
                      <Badge className="bg-green-100 text-green-800">
                        Live Detection Aktif
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="relative bg-black" style={{ minHeight: "400px" }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full block"
                      style={{
                        maxHeight: "600px",
                        objectFit: "contain",
                        backgroundColor: "#000",
                      }}
                    />

                    {liveDetections.map((result, index) => {
                      const videoWidth = videoRef.current?.videoWidth || 0
                      const videoHeight = videoRef.current?.videoHeight || 0

                      const hasValidBox =
                        result.bbox.x2 > result.bbox.x1 &&
                        result.bbox.y2 > result.bbox.y1 &&
                        videoWidth > 0 &&
                        videoHeight > 0

                      if (!hasValidBox) return null

                      const isNormalizedBox =
                        result.bbox.x2 <= 1 && result.bbox.y2 <= 1

                      const left = isNormalizedBox
                        ? result.bbox.x1 * 100
                        : (result.bbox.x1 / videoWidth) * 100

                      const top = isNormalizedBox
                        ? result.bbox.y1 * 100
                        : (result.bbox.y1 / videoHeight) * 100

                      const width = isNormalizedBox
                        ? (result.bbox.x2 - result.bbox.x1) * 100
                        : ((result.bbox.x2 - result.bbox.x1) / videoWidth) * 100

                      const height = isNormalizedBox
                        ? (result.bbox.y2 - result.bbox.y1) * 100
                        : ((result.bbox.y2 - result.bbox.y1) / videoHeight) * 100

                      return (
                        <div
                          key={`live-bbox-${result.label}-${index}`}
                          className="absolute border-2 border-cyan-400 rounded-md pointer-events-none"
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-0 bg-cyan-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {result.label} • {(result.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      )
                    })}

                    {isLiveProcessing ? (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-2 rounded-full">
                        Memproses frame...
                      </div>
                    ) : null}
                  </div>

                  {cameraError ? (
                    <div className="bg-red-50 border-t-4 border-red-500 p-4">
                      <p className="text-red-800 text-sm">{cameraError}</p>
                    </div>
                  ) : null}

                  <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 space-y-3">
                    <Button
                      onClick={handleCapture}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-8 text-xl font-bold"
                    >
                      <Circle className="h-8 w-8 mr-3" fill="currentColor" />
                      Ambil Foto Sekarang
                    </Button>

                    <Button
                      onClick={
                        isLiveDetecting ? stopLiveDetection : handleStartLiveDetection
                      }
                      variant="outline"
                      className="w-full py-6 text-lg font-bold"
                    >
                      {isLiveDetecting ? (
                        <>
                          <Square className="h-5 w-5 mr-2" />
                          Stop Live Detection
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Mulai Live Detection
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {previewImage ? (
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-serif font-bold text-gray-900">
                    Preview Gambar dan Bounding Box
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-auto"
                      onLoad={(event) => {
                        setImageNaturalSize({
                          width: event.currentTarget.naturalWidth,
                          height: event.currentTarget.naturalHeight,
                        })
                      }}
                    />

                    {!isLoading &&
                      detections.map((result, index) => {
                        const hasValidBox =
                          result.bbox.x2 > result.bbox.x1 &&
                          result.bbox.y2 > result.bbox.y1 &&
                          imageNaturalSize.width > 0 &&
                          imageNaturalSize.height > 0

                        if (!hasValidBox) return null

                        const isNormalizedBox =
                          result.bbox.x2 <= 1 && result.bbox.y2 <= 1

                        const left = isNormalizedBox
                          ? result.bbox.x1 * 100
                          : (result.bbox.x1 / imageNaturalSize.width) * 100

                        const top = isNormalizedBox
                          ? result.bbox.y1 * 100
                          : (result.bbox.y1 / imageNaturalSize.height) * 100

                        const width = isNormalizedBox
                          ? (result.bbox.x2 - result.bbox.x1) * 100
                          : ((result.bbox.x2 - result.bbox.x1) /
                              imageNaturalSize.width) *
                            100

                        const height = isNormalizedBox
                          ? (result.bbox.y2 - result.bbox.y1) * 100
                          : ((result.bbox.y2 - result.bbox.y1) /
                              imageNaturalSize.height) *
                            100

                        return (
                          <div
                            key={`bbox-${result.label}-${index}`}
                            className="absolute border-2 border-cyan-400 rounded-md pointer-events-none"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              width: `${width}%`,
                              height: `${height}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-cyan-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {result.label} • {(result.confidence * 100).toFixed(1)}%
                            </div>
                          </div>
                        )
                      })}

                    {isLoading ? (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-3"></div>
                          <p className="text-white">Memproses deteksi...</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {detectResult && !isLoading ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-serif font-bold text-gray-900">
                      Hasil Deteksi AI
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Berhasil
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-gray-200 bg-cyan-50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Total Deteksi
                        </p>
                        <p className="text-3xl font-serif font-bold text-cyan-600">
                          {detections.length}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 bg-amber-50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Prediksi Utama
                        </p>
                        <p className="text-2xl font-serif font-bold text-amber-600">
                          {topPrediction}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 bg-green-50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Estimasi Harga
                        </p>
                        <p className="text-2xl font-serif font-bold text-green-700">
                          {formatCurrency(totalEstimatedPrice, "IDR")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-gray-900">
                      Detail Deteksi dan Harga
                    </h3>

                    <div className="space-y-2">
                      {detections.length > 0 ? (
                        detections.map((result, index) => (
                          <div
                            key={`${result.label}-${index}`}
                            className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 gap-4"
                          >
                            <div>
                              <p className="font-serif font-bold text-gray-900">
                                {result.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                BBox: ({result.bbox?.x1 ?? "-"},{" "}
                                {result.bbox?.y1 ?? "-"}) - (
                                {result.bbox?.x2 ?? "-"},{" "}
                                {result.bbox?.y2 ?? "-"})
                              </p>
                              <p className="text-sm text-gray-500">
                                Harga:{" "}
                                <span className="font-semibold text-green-700">
                                  {result.price
                                    ? `${formatCurrency(
                                        result.price.current_price,
                                        result.price.currency
                                      )} / ${result.price.unit}`
                                    : "Belum cocok dengan data harga"}
                                </span>
                              </p>
                            </div>

                            <div className="text-left md:text-right space-y-2">
                              <Badge className="bg-cyan-100 text-cyan-800">
                                Confidence {(result.confidence * 100).toFixed(1)}%
                              </Badge>
                              {result.price ? (
                                <Badge className="bg-green-100 text-green-800 block w-fit md:ml-auto">
                                  {result.price.category}
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">
                            Backend berhasil merespons, tetapi tidak ada array deteksi yang bisa dibaca frontend.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (detectResult) {
                        sessionStorage.setItem(
                          "latest_detection_result",
                          JSON.stringify(detectResult)
                        )
                      }

                      router.push("/audits")
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-bold"
                  >
                    <Database className="h-5 w-5 mr-2" />
                    Simpan dan Lanjut ke Audit
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {!previewImage && !isCameraOpen && !errorMessage ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="pt-12 text-center pb-12">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Pilih gambar untuk memulai deteksi sampah
                  </p>
                  <p className="text-gray-400 text-sm">
                    AI akan memproses gambar, menampilkan bounding box, label,
                    confidence, dan harga sampah.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}