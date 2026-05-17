import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL =
  process.env.HARGAI_BACKEND_URL || "https://hargai.site"

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")

    const response = await fetch(`${BACKEND_BASE_URL}/audits/history`, {
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
      { message: "Backend history tidak dapat dijangkau.", detail: error?.message || "Unknown error" },
      { status: 503 }
    )
  }
}