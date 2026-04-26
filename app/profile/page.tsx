"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type User = {
  id: string | number
  name: string
  email: string
  role: string
}

export default function ProfilePage() {
  const [user] = useState<User | null>(null)
  const [loading] = useState(false)

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
                    <p className="text-sm text-gray-500">Nama</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.name}
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
                    Belum ada data profil karena halaman ini belum terhubung ke sistem login.
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