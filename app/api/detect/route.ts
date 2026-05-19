import { NextRequest, NextResponse } from "next/server"

const BACKEND_DETECT_URL =
  process.env.HARGAI_DETECT_URL ||
  (process.env.HARGAI_BACKEND_URL
    ? `${process.env.HARGAI_BACKEND_URL}/detect`
    : "https://hargai.site/detect")

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")
    const incoming = await req.formData()
    const file = incoming.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File tidak ditemukan." },
        { status: 400 }
      )
    }

    const extFromType =
      file.type === "image/png"
        ? "png"
        : file.type === "image/jpeg" || file.type === "image/jpg"
          ? "jpg"
          : ""

    const originalName = file.name || ""
    const hasValidExtension = /\.(jpg|jpeg|png)$/i.test(originalName)

    const safeFileName = hasValidExtension
      ? originalName
      : `upload-${Date.now()}.${extFromType || "jpg"}`

    const formData = new FormData()
    formData.append("file", file, safeFileName)

    const headers: HeadersInit = {}
    if (auth) {
      headers.Authorization = auth
    }

    const response = await fetch(BACKEND_DETECT_URL, {
      method: "POST",
      headers,
      body: formData,
    })

    const contentType = response.headers.get("content-type") || "application/json"
    const text = await response.text()

    if (!response.ok) {
      let backendError: any = null

      try {
        backendError = JSON.parse(text)
      } catch {
        backendError = null
      }

      return NextResponse.json(
        {
          message:
            backendError?.message ||
            backendError?.detail ||
            "Request ke backend tidak valid.",
          detail: backendError?.detail || text,
          backend_status: response.status,
        },
        { status: response.status }
      )
    }

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Backend deteksi tidak dapat dijangkau.",
        detail: error?.message || "Unknown error",
      },
      { status: 503 }
    )
  }
}