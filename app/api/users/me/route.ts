import { NextRequest, NextResponse } from "next/server"

const BACKEND_ME_URL =
  process.env.BACKEND_BASE_URL
    ? `${process.env.BACKEND_BASE_URL}/auth/me`
    : "https://hargai.site/auth/me"

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")
    const response = await fetch(BACKEND_ME_URL, {
      method: "GET",
      headers: {
        Authorization: auth || "",
      },
    })
    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Backend me tidak dapat dijangkau", detail: error.message },
      { status: 503 }
    )
  }
}