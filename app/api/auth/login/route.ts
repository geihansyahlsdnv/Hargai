import { NextRequest, NextResponse } from "next/server"

const BACKEND_LOGIN_URL = "http://34.101.46.140:8000/auth/login"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = await fetch(BACKEND_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Backend login tidak dapat dijangkau", detail: error.message },
      { status: 503 }
    )
  }
}