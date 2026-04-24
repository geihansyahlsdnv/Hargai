import { NextRequest, NextResponse } from "next/server"

const BACKEND_LOGIN_URL =
  process.env.HARGAI_LOGIN_URL || "http://hargai.site/auth/login"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(BACKEND_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const contentType = response.headers.get("content-type") || "application/json"
    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Backend login tidak dapat dijangkau.",
        detail: error?.message || "Unknown error",
      },
      { status: 503 }
    )
  }
}