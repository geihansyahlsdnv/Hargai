import { NextRequest, NextResponse } from "next/server"

const BACKEND_WASTE_TYPES_URL =
  process.env.HARGAI_WASTE_TYPES_URL ||
  (process.env.HARGAI_BACKEND_URL
    ? `${process.env.HARGAI_BACKEND_URL}/waste-types`
    : "https://hargai.site/waste-types")

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")

    const headers: HeadersInit = {}
    if (auth) headers.Authorization = auth

    const response = await fetch(BACKEND_WASTE_TYPES_URL, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    const text = await response.text()
    const contentType = response.headers.get("content-type") || "application/json"

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Data harga sampah tidak dapat dijangkau.",
        detail: error?.message || "Unknown error",
      },
      { status: 503 }
    )
  }
}