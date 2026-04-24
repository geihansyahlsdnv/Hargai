import { api, setAuthToken } from "@/lib/api"

export type LoginResponse = {
  access_token: string
  token_type: "bearer"
}

export type UserProfile = {
  id: number
  name: string
  email: string
  role: "admin" | "supervisor" | "operator"
}

const TOKEN_KEY = "hargai_token"
const USER_KEY = "hargai_user"

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export const getUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const bootstrapAuth = () => {
  const token = getToken()
  setAuthToken(token)
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  })

  localStorage.setItem(TOKEN_KEY, data.access_token)
  setAuthToken(data.access_token)

  const me = await api.get<UserProfile>("/users/me")
  localStorage.setItem(USER_KEY, JSON.stringify(me.data))

  return me.data
}

export const logout = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem("latest_detection_result")
  setAuthToken(null)
}