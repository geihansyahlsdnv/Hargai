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

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(BACKEND_DETECT_URL, {
      method: "POST",
      headers: {
        Authorization: auth || "",
      },
      body: formData,
    })

    const contentType = response.headers.get("content-type") || "application/json"
    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": contentType },
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