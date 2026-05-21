import { NextRequest, NextResponse } from "next/server"

const BACKEND_ME_URL =
  process.env.BACKEND_BASE_URL
    ? `${process.env.BACKEND_BASE_URL}/auth/me`
    : "https://hargai.site/auth/me"

// ─── GET — ambil data user yang sedang login ──────────────────────────────────
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

// ─── PATCH — update data user (username, email, dsb) ─────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")
    const body = await req.text()

    const response = await fetch(BACKEND_ME_URL, {
      method: "PATCH",
      headers: {
        Authorization: auth || "",
        "Content-Type": "application/json",
      },
      body,
    })

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memperbarui data user", detail: error.message },
      { status: 503 }
    )
  }
}

// ─── DELETE — hapus akun user yang sedang login ───────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization")

    const response = await fetch(BACKEND_ME_URL, {
      method: "DELETE",
      headers: {
        Authorization: auth || "",
      },
    })

    // 204 No Content — backend tidak mengembalikan body
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghapus akun", detail: error.message },
      { status: 503 }
    )
  }
}