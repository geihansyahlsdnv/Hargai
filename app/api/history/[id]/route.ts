// app/api/history/[id]/route.ts

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "https://hargai.site"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = req.headers.get("authorization")

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/audits/${id}`, {
      headers: { Authorization: auth || "" },
      cache: "no-store",
    })
    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (err) {
    console.error(`[GET /api/history/${id}] Backend unreachable:`, err)
    return Response.json(
      { detail: "Backend tidak dapat dihubungi." },
      { status: 503 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = req.headers.get("authorization")

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/audits/${id}`, {
      method: "DELETE",
      headers: { Authorization: auth || "" },
    })

    if (response.status === 204) {
      return new Response(null, { status: 204 })
    }

    const data = await response.json().catch(() => ({}))
    return Response.json(data, { status: response.status })
  } catch (err) {
    console.error(`[DELETE /api/history/${id}] Backend unreachable:`, err)
    return Response.json(
      { detail: "Backend tidak dapat dihubungi." },
      { status: 503 }
    )
  }
}