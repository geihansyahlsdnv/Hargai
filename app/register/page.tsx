"use client"

import type React from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return "Nama depan wajib diisi."
    if (!formData.lastName.trim()) return "Nama belakang wajib diisi."
    if (!formData.email.trim()) return "Email wajib diisi."
    if (!formData.phone.trim()) return "Nomor telepon wajib diisi."
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

    // Backend spec yang ada belum menyediakan endpoint register.
    // Jadi registrasi belum bisa diproses secara nyata.
    setInfo(
      "Pendaftaran akun belum tersedia karena backend belum menyediakan endpoint registrasi. Silakan gunakan akun yang sudah ada atau hubungi administrator."
    )
    setIsSubmitting(false)
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
              Halaman ini siap dipakai, tetapi backend registrasi belum tersedia.
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 font-sans">
                      Nama Depan
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg font-sans"
                      placeholder="Masukkan nama depan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 font-sans">
                      Nama Belakang
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg font-sans"
                      placeholder="Masukkan nama belakang"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-sans">
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg font-sans"
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 font-sans">
                    Nomor Telepon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg font-sans"
                    placeholder="+62 812 3456 7890"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 font-sans">
                      Kata Sandi
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg font-sans"
                        placeholder="Buat kata sandi"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 font-sans">
                      Konfirmasi Kata Sandi
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg font-sans"
                        placeholder="Ulangi kata sandi"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 font-sans leading-relaxed">
                      Saya setuju dengan{" "}
                      <Link href="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        Syarat Layanan
                      </Link>{" "}
                      dan{" "}
                      <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
                        Kebijakan Privasi
                      </Link>
                    </Label>
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : null}

                {info ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">{info}</p>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms || isSubmitting}
                  className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  {isSubmitting ? "Memproses..." : "Buat Akun"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-sans">Sudah memiliki akun?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent font-sans"
                    >
                      Masuk Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500 font-sans">
              Informasi pribadi Anda dienkripsi dan aman. Registrasi akan diaktifkan setelah backend menyediakan endpoint pendaftaran.
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">HargAI</h3>
              <p className="text-gray-400 font-sans text-sm">
                Sistem deteksi dan audit sampah berbasis AI untuk monitoring pengelolaan sampah secara efisien.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-gray-400 font-sans text-sm">
                <li><Link href="/classify" className="hover:text-cyan-400 transition-colors">Deteksi Sampah</Link></li>
                <li><Link href="/history" className="hover:text-cyan-400 transition-colors">Audit & Laporan</Link></li>
                <li><Link href="/reports" className="hover:text-cyan-400 transition-colors">Analitik</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400 font-sans text-sm">
                <li><Link href="/about" className="hover:text-cyan-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Dukungan</Link></li>
                <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400 font-sans text-sm">
                <p>📧 info@hargai-project.com</p>
                <p>📞 +62 812 3456 7890</p>
                <p>📍 Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-sans text-sm">
              © 2026 HargAI - Sistem Deteksi Sampah Berbasis AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}