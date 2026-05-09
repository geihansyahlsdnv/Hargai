"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowRight, UserPlus } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator",
    agreeToTerms: false,
  })
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return "Nama depan wajib diisi."
    if (!formData.lastName.trim()) return "Nama belakang wajib diisi."
    if (!formData.email.trim()) return "Email wajib diisi."
    if (!formData.password.trim()) return "Kata sandi wajib diisi."
    if (formData.password.length < 6) return "Kata sandi minimal 6 karakter."
    if (formData.password !== formData.confirmPassword) return "Konfirmasi kata sandi tidak cocok."
    if (!formData.agreeToTerms) return "Anda harus menyetujui syarat layanan."
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setIsSubmitting(true)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.firstName + " " + formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Registrasi gagal")
      }

      setInfo("Akun berhasil dibuat! Silakan login.")
      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
              <UserPlus className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-3xl font-serif font-black text-gray-900">Buat Akun Anda</h2>
            <p className="mt-2 text-gray-600 font-sans">
              Halaman ini siap dipakai
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-serif font-bold">Mulai Sekarang</CardTitle>
              <CardDescription className="font-sans">
                Lengkapi data diri Anda untuk membuat akun baru
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    Saya setuju dengan syarat layanan
                  </Label>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {info && <p className="text-green-600 text-sm">{info}</p>}

                <Button type="submit" className="w-full flex justify-center py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-sans" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Buat Akun"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                Sudah memiliki akun?{" "}
                <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Masuk Sekarang
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}