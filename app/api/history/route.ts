import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.BACKEND_BASE_URL ?? "https://hargai.site"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")

  try {
    const response = await fetch(`${BACKEND}/audits/history`, {
      headers: {
        Authorization: auth || "",
      },
      cache: "no-store",
    })

    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers: noStoreHeaders,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Backend tidak dapat dijangkau.",
        detail: err?.message,
      },
      {
        status: 503,
        headers: noStoreHeaders,
      }
    )
  }
}