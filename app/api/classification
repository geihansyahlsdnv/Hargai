import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "https://hargai.site"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = req.headers.get("authorization")

  try {
    const body = await req.text()

    const response = await fetch(
      `${BACKEND_BASE_URL}/classification/${id}/volume`,
      {
        method: "PATCH",
        headers: {
          Authorization: auth || "",
          "Content-Type": "application/json",
        },
        body,
      }
    )

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    return NextResponse.json(
      { detail: "Backend tidak dapat dihubungi." },
      { status: 503 }
    )
  }
}