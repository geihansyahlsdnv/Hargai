"use client"

import type React from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logika reset kata sandi di sini
    console.log("Permintaan reset kata sandi untuk:", email)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-cyan-600" />
                </div>
                <h2 className="text-3xl font-serif font-black text-gray-900">Lupa Kata Sandi?</h2>
                <p className="mt-2 text-gray-600 font-sans">
                  Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan instruksi pengaturan ulang.
                </p>
              </div>

              {/* Form Reset */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-serif font-bold">Atur Ulang Kata Sandi</CardTitle>
                  <CardDescription className="font-sans">
                    Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-lg font-sans py-3"
                        placeholder="Masukkan alamat email Anda"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full flex justify-center py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-sans"
                    >
                      Kirim Instruksi Reset
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 font-sans">Ingat kata sandi Anda?</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent font-sans"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Kembali ke Masuk
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* State Sukses */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-serif font-black text-gray-900">Periksa Email Anda</h2>
                <p className="mt-2 text-gray-600 font-sans">
                  Kami telah mengirimkan instruksi pengaturan ulang kata sandi ke alamat email Anda.
                </p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <p className="text-sm text-cyan-800 font-sans">
                        <strong>Email dikirim ke:</strong> {email}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 font-sans">
                      <p>Silakan periksa email Anda dan klik tautan reset untuk membuat kata sandi baru.</p>
                      <p>
                        <strong>Tidak menerima email?</strong> Periksa folder spam atau hubungi tim dukungan kami.
                      </p>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent font-sans"
                      >
                        Coba Email Lain
                      </Button>

                      <Link href="/login">
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-sans">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Kembali ke Masuk
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Bagian Bantuan */}
          <div className="text-center">
            <p className="text-xs text-gray-500 font-sans mb-2">
              Butuh bantuan? Hubungi tim dukungan kami di{" "}
              <a href="mailto:info@hargai-project.com" className="text-cyan-600 hover:text-cyan-700">
                info@hargai-project.com
              </a>
            </p>
            <p className="text-xs text-gray-500 font-sans">
              Atau hubungi kami di{" "}
              <a href="tel:+6281234567890" className="text-cyan-600 hover:text-cyan-700">
                +62 812 3456 7890
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                <li><Link href="/consultation" className="hover:text-cyan-400 transition-colors">Deteksi Sampah</Link></li>
                <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Audit & Laporan</Link></li>
                <li><Link href="/testimonials" className="hover:text-cyan-400 transition-colors">Analitik</Link></li>
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
              <h4 className="text-lg font-serif font-bold mb-4">Status</h4>
              <div className="space-y-2 text-gray-400 font-sans text-sm">
                <li className="flex items-center gap-2">
            <span>📧</span>
            <span>info@hargai-project.com</span>
          </li>
          <li className="flex items-center gap-2">
            <span>📞</span>
            <span>+62 812 3456 7890</span>
          </li>
          <li className="flex items-center gap-2">
            <span>📍</span>
            <span>Jakarta, Indonesia</span>
          </li>
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