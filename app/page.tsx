import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Shield, TrendingUp, Users, CheckCircle } from "lucide-react"
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
              Klasifikasi Sampah Digital & <span className="text-cyan-600">Optimasi Logistik</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Solusi cerdas berbasis AI untuk memvalidasi jenis sampah dan mempercepat rantai pasok. 
              Tingkatkan efisiensi pengumpulan dengan koneksi langsung ke industri daur ulang besar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/classify">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
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

      {/* Konten Utama - Fokus pada Supply Chain */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">Efisiensi Rantai Pasok Terpadu</h2>
              <p className="text-lg text-gray-600 mb-6 font-sans leading-relaxed">
                Kami menggunakan teknologi Computer Vision untuk memangkas waktu pemilahan manual. Dengan klasifikasi otomatis, 
                pengepul dapat mengelompokkan sampah anorganik sesuai standar industri secara cepat dan tepat.
              </p>
              <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
                Data hasil klasifikasi terhubung langsung dengan sistem logistik kami, memungkinkan penjadwalan 
                pengiriman yang lebih efisien dari gudang pengepul menuju pusat pemrosesan akhir atau pabrik.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-serif font-black text-cyan-600">98%</div>
                  <div className="text-sm text-gray-600 font-sans">Akurasi Sortir</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-black text-cyan-600">Fast</div>
                  <div className="text-sm text-gray-600 font-sans">Proses Logistik</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-black text-cyan-600">Direct</div>
                  <div className="text-sm text-gray-600 font-sans">Akses Pabrik</div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* GAMBAR DIPERBARUI: Visualisasi AI untuk Sortir */}
              <img
                src="/images/gambar-1.jpg" // Jalur placeholder baru
                alt="Visualisasi sistem Computer Vision HargAI mengklasifikasi berbagai jenis sampah anorganik di fasilitas pengepul"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan - Fokus pada Operasional */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">Manfaat Bagi Operasional Pengepul</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Platform ini dirancang untuk memaksimalkan produktivitas harian dan manajemen inventaris Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Standarisasi Material</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Pastikan kualitas material sampah memenuhi kriteria pabrik daur ulang untuk menghindari penolakan muatan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Harga Pabrik Langsung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Dapatkan akses informasi harga beli terkini dari industri besar untuk meningkatkan margin keuntungan Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Manajemen Inventaris</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Pantau volume stok sampah yang terkumpul secara digital untuk memudahkan perencanaan logistik keluar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filosofi */}
      <section id="philosophy" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">Misi Keberlanjutan Industri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Memperkuat posisi pengepul dalam ekosistem ekonomi sirkular nasional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Transparansi Penjualan</h3>
                    <p className="text-gray-600 font-sans">
                      Menghilangkan perantara yang tidak perlu untuk memastikan harga jual yang lebih adil bagi pengepul.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Skalabilitas Bisnis</h3>
                    <p className="text-gray-600 font-sans">
                      Membantu mitra pengumpul tumbuh melalui akses data pasar dan efisiensi operasional harian.
                  </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* GAMBAR DIPERBARUI: Visualisasi Logistik Industri */}
              <img
                src="/images/gambar-2.jpg" // Jalur placeholder baru
                alt="Pengepul menggunakan tablet HargAI untuk mengelola pengiriman sampah yang sudah disortir ke truk logistik industri daur ulang besar"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

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