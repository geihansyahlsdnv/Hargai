"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser, getStoredToken } from "@/lib/auth"

type User = {
  id: string | number
  username: string
  email: string
  role: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // try stored user first for instant render
        const stored = getStoredUser()
        if (stored) {
          setUser(stored as unknown as User)
          setLoading(false)
        }

        // then refresh from backend
        const token = getStoredToken()
        if (!token) return

        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) return
        const data = await res.json()
        setUser(data)
        localStorage.setItem("user", JSON.stringify(data))
      } catch {
        // stored user is still shown if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-black text-gray-900 mb-8">
            Profile Pengguna
          </h1>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                Informasi Akun
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-gray-500">Memuat profil...</p>
              ) : user ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.username}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-lg font-semibold text-cyan-700 uppercase">
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.id}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-amber-800 text-sm">
                    Data profil tidak ditemukan. Silakan login ulang.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
