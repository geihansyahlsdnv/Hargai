"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // Jika ada ?redirect=... pakai itu, kalau tidak langsung ke /dashboard
  const redirectTo = useMemo(
    () => searchParams.get("redirect") || "/profile",
    [searchParams]
  )

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername]         = useState("")
  const [password, setPassword]         = useState("")
  const [rememberMe, setRememberMe]     = useState(false)
  const [error, setError]               = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!username.trim() || !password.trim()) {
        setError("Username dan kata sandi wajib diisi.")
        setIsSubmitting(false)
        return
      }

      await login(username, password)

      // Setelah berhasil login → arahkan ke dashboard (atau redirect param)
      router.replace(redirectTo)
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.status === 401) {
        setError("Username atau kata sandi salah.")
      } else {
        setError("Gagal terhubung ke server. Silakan coba lagi.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-3xl font-serif font-black text-gray-900">
              Selamat Datang Kembali
            </h2>
            <p className="mt-2 text-gray-600 font-sans">
              Masuk untuk mengakses dasbor pengelolaan sampah Anda
            </p>
          </div>

          {/* Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-serif font-bold">Masuk</CardTitle>
              <CardDescription className="font-sans">
                Masukkan kredensial Anda untuk mengakses akun
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="font-sans font-semibold text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-sans font-semibold text-gray-700">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff className="h-5 w-5 text-gray-400" />
                        : <Eye className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>

                {/* Remember me + forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember-me" className="text-sm text-gray-600 font-sans cursor-pointer">
                      Ingat saya
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-sans font-medium"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-sans">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sedang masuk..." : "Masuk"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                {/* Register link */}
                <div className="text-center text-sm text-gray-600 font-sans">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="text-cyan-600 hover:text-cyan-700 font-semibold"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}