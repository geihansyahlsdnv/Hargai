import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  ScanLine,
  Wallet,
  LayoutGrid,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

{/* Hero Section */}
<section className="bg-gradient-to-br from-gray-50 to-white py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
        Klasifikasi Sampah Digital &{" "}
        <span className="text-cyan-600">AI Modern</span>
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
        Solusi berbasis Artificial Intelligence untuk membantu pengguna
        mengenali jenis sampah secara otomatis melalui kamera maupun unggahan
        gambar dengan proses yang cepat, praktis, dan mudah digunakan.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/classify">
          <Button
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg"
          >
            Mulai Klasifikasi
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link href="/about">
          <Button
            size="lg"
            variant="outline"
            className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-4 text-lg bg-transparent"
          >
            Tentang Kami
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Konten Utama */}
<section id="about" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">
          Teknologi AI untuk Klasifikasi Sampah
        </h2>

        <p className="text-lg text-gray-600 mb-6 font-sans leading-relaxed">
          HargAI menggunakan teknologi Computer Vision modern untuk membantu
          proses identifikasi jenis sampah secara otomatis melalui kamera
          maupun unggahan gambar.
        </p>

        <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
          Dengan sistem klasifikasi berbasis AI, pengguna dapat mengetahui
          kategori sampah dan estimasi nilai ekonominya secara cepat, praktis,
          dan mudah dipahami.
        </p>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-serif font-black text-cyan-600">
              AI
            </div>

            <div className="text-sm text-gray-600 font-sans">
              Deteksi Otomatis
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-serif font-black text-cyan-600">
              Fast
            </div>

            <div className="text-sm text-gray-600 font-sans">
              Analisis Cepat
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-serif font-black text-cyan-600">
              Easy
            </div>

            <div className="text-sm text-gray-600 font-sans">
              Mudah Digunakan
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <img
          src="/images/gambar-1.jpg"
          alt="Visualisasi sistem AI HargAI untuk klasifikasi sampah"
          className="rounded-lg shadow-xl"
        />
      </div>
    </div>
  </div>
</section>

{/* Keunggulan */}
<section id="services" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
        Fitur Utama HargAI
      </h2>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
        Dirancang untuk memberikan pengalaman klasifikasi sampah yang cepat,
        modern, dan mudah digunakan.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-cyan-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Deteksi Akurat
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Teknologi AI membantu mengenali jenis sampah secara otomatis dengan
            proses yang cepat dan akurat.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-amber-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Estimasi Harga
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Menampilkan estimasi nilai ekonomi berdasarkan kategori sampah yang
            berhasil dikenali.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-cyan-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Mudah Digunakan
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Tampilan sederhana dan modern agar mudah digunakan oleh semua
            pengguna.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

{/* Keunggulan untuk Pengepul */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
        Keunggulan untuk Pengepul
      </h2>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
        Membantu proses pengelolaan dan identifikasi sampah menjadi lebih
        cepat, efisien, dan modern.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ScanLine className="h-8 w-8 text-cyan-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Identifikasi Cepat
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Membantu pengepul mengenali jenis sampah secara otomatis melalui
            kamera tanpa proses pengecekan manual yang memakan waktu.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-amber-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Estimasi Nilai Sampah
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Sistem membantu menampilkan estimasi harga berdasarkan kategori
            sampah yang berhasil dikenali oleh AI.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="h-8 w-8 text-cyan-600" />
          </div>

          <CardTitle className="text-xl font-serif font-bold">
            Pengelolaan Lebih Mudah
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 font-sans text-center">
            Membantu pengepul memahami kategori sampah dengan tampilan yang
            sederhana dan mudah digunakan.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

{/* Manfaat untuk Pengepul */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <img
          src="/images/gambar-5.webp"
          alt="Pengepul menggunakan sistem AI HargAI"
          className="rounded-lg shadow-xl"
        />
      </div>

      <div>
        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">
          Manfaat Bagi Pengepul
        </h2>

        <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
          HargAI membantu proses pengelolaan sampah menjadi lebih praktis
          dengan teknologi AI yang mampu melakukan klasifikasi otomatis dan
          menampilkan estimasi nilai ekonomi sampah secara cepat.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Mempercepat Proses Sortir
              </h3>

              <p className="text-gray-600 font-sans">
                Mengurangi proses identifikasi manual dengan bantuan AI
                klasifikasi real-time.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Informasi Harga Lebih Praktis
              </h3>

              <p className="text-gray-600 font-sans">
                Membantu pengguna mengetahui estimasi nilai ekonomi dari
                sampah yang berhasil dikenali.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Mudah Digunakan
              </h3>

              <p className="text-gray-600 font-sans">
                Tampilan sederhana dan modern sehingga mudah dipahami oleh
                pengguna umum maupun pengepul.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Filosofi */}
<section id="philosophy" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
        Pendekatan Teknologi Kami
      </h2>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
        Teknologi AI modern yang membantu proses klasifikasi sampah menjadi
        lebih praktis dan efisien.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Deteksi Real-time YOLOv8
              </h3>

              <p className="text-gray-600 font-sans">
                Proses identifikasi jenis sampah secara otomatis melalui kamera
                maupun unggahan gambar.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Estimasi Nilai Ekonomi
              </h3>

              <p className="text-gray-600 font-sans">
                Sistem membantu menampilkan estimasi harga berdasarkan kategori
                sampah yang berhasil dikenali.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />

            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Pengalaman Pengguna Modern
              </h3>

              <p className="text-gray-600 font-sans">
                Dirancang agar mudah digunakan oleh pengguna umum tanpa
                memerlukan proses yang rumit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <img
          src="/images/gambar-2.jpg"
          alt="Pengguna menggunakan teknologi AI HargAI"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
</section>

{/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">
                HargAI
              </h3>
              <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-2xl">
                HargAI adalah platform klasifikasi sampah berbasis AI yang membantu pengguna mengenali jenis sampah dan melihat estimasi harga secara cepat.
              </p>
            </div>

            <div className="md:text-right">
              <h4 className="text-lg font-serif font-bold mb-4">
                Mulai Menggunakan
              </h4>
              <p className="text-gray-400 font-sans text-sm mb-4">
                Daftar akun untuk mengakses fitur.
              </p>
              <Link href="/register">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold">
                  Sign Up / Register
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 font-sans text-sm text-center md:text-left">
              © 2026 HargAI. All rights reserved.
            </p>
            <p className="text-gray-500 font-sans text-xs text-center md:text-right">
              Powered by HargAI Waste Classification System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}