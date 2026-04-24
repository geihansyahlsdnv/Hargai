"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { bootstrapAuth, isAuthenticated } from "@/lib/auth"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    bootstrapAuth()

    if (!isAuthenticated()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/")}`)
      return
    }

    setReady(true)
  }, [router, pathname])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Memeriksa sesi login...</p>
          <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}