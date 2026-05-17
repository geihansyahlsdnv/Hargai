import { setAuthToken } from "@/lib/api"

export async function login(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw res
  const data = await res.json()
  localStorage.setItem("access_token", data.access_token)

  const meRes = await fetch("/api/users/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  if (!meRes.ok) throw new Error("Gagal mengambil data user")
  const user = await meRes.json()
  localStorage.setItem("user", JSON.stringify(user))
  return user
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("access_token")
}

export function bootstrapAuth(): void {
  if (typeof window === "undefined") return
  const token = localStorage.getItem("access_token")
  if (token) {
    setAuthToken(token)
  }
}

export function logout(): void {
  localStorage.removeItem("access_token")
  localStorage.removeItem("user")
  setAuthToken(null)
}

export function getStoredUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}