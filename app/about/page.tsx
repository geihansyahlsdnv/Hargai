import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf, Eye, BarChart3, Recycle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
              Tentang <span className="text-cyan-600">HargAI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Merevolusi pengelolaan limbah melalui integrasi Computer Vision dan Analitik Data untuk masa depan yang lebih berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">Cerita Kami</h2>
              <p className="text-lg text-gray-600 mb-6 font-sans leading-relaxed">
                Dimulai dari kesadaran akan rendahnya tingkat pemilahan sampah, HargAI hadir sebagai solusi cerdas berbasis AI. Kami percaya bahwa setiap limbah memiliki nilai ekonomi jika dikelola dengan data yang tepat.
              </p>
              <p className="text-lg text-gray-600 mb-6 font-sans leading-relaxed">
                Melalui model deteksi YOLOv8, kami membantu masyarakat dan industri mengidentifikasi jenis sampah secara instan. Kami berkomitmen memberikan transparansi data melalui audit sampah yang akurat.
              </p>
              <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
                Saat ini, sistem kami terus dikembangkan untuk mendukung ekonomi sirkular, membantu pengguna mengetahui estimasi nilai ekonomi dari sampah yang mereka kumpulkan.
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/gambar-3.jpeg"
                alt="Pengembangan Teknologi HargAI"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">Nilai Utama Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Prinsip yang mendasari setiap baris kode dan inovasi yang kami ciptakan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Inovasi Presisi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Menggunakan teknologi Computer Vision terkini untuk memastikan akurasi deteksi sampah yang tinggi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Keberlanjutan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Fokus utama kami adalah dampak lingkungan jangka panjang dan mendukung gerakan zero waste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle className="text-xl font-serif font-bold">Data Terukur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-sans text-center">
                  Memberikan laporan audit yang transparan untuk membantu pengambilan keputusan yang lebih baik.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team / Tim Pengembang */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Raihan Maulana */}
  <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
    <CardContent className="pt-6">
      <img src="/images/avatar/raihan.jpg" alt="Raihan Maulana" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Raihan Maulana</h3>
      <p className="text-cyan-600 font-sans text-sm mb-3">AI Engineer</p>
      <p className="text-gray-600 font-sans text-xs">Optimasi model YOLOv8 untuk akurasi deteksi sampah yang tinggi.</p>
    </CardContent>
  </Card>

  {/* Allwan Raharjo */}
  <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
    <CardContent className="pt-6">
      <img src="/images/avatar/allwan.jpg" alt="Allwan Raharjo" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Allwan Raharjo</h3>
      <p className="text-cyan-600 font-sans text-sm mb-3">Data Engineer</p>
      <p className="text-gray-600 font-sans text-xs">Arsitektur pipeline data dan manajemen database audit sampah.</p>
    </CardContent>
  </Card>

  {/* Geihansyah */}
  <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
    <CardContent className="pt-6">
      <img src="/images/avatar/geihan.jpg" alt="Geihansyah" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Geihansyah</h3>
      <p className="text-cyan-600 font-sans text-sm mb-3">Backend Developer</p>
      <p className="text-gray-600 font-sans text-xs">Pengembangan API, keamanan sistem, dan logika sisi server.</p>
    </CardContent>
  </Card>

  {/* Farel Rabbani */}
  <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
    <CardContent className="pt-6">
      <img src="/images/avatar/farel.jpg" alt="Farel Rabbani" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">Farel Rabbani</h3>
      <p className="text-cyan-600 font-sans text-sm mb-3">Frontend Developer</p>
      <p className="text-gray-600 font-sans text-xs">Membangun UI responsif dan visualisasi dashboard analitik.</p>
    </CardContent>
  </Card>
</div>

      {/* Our Approach */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">Metodologi Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Alur kerja cerdas yang mengubah gambar menjadi data bernilai ekonomi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Deteksi Real-time YOLOv8</h3>
                    <p className="text-gray-600 font-sans">
                      Proses identifikasi jenis sampah (organik, anorganik, B3) secara cepat melalui kamera.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Estimasi Nilai Ekonomi</h3>
                    <p className="text-gray-600 font-sans">
                      Perhitungan otomatis harga sampah berdasarkan kategori dan berat rata-rata.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Analitik Riwayat Audit</h3>
                    <p className="text-gray-600 font-sans">
                      Penyimpanan data jangka panjang untuk memantau tren pembuangan sampah setiap periode.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/images/gambar-4.jpeg"
                alt="Analisis Data Sampah"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-black text-white mb-4">Siap Mengelola Sampah Lebih Cerdas?</h2>
          <p className="text-xl text-cyan-100 mb-8 font-sans">
            Mulai deteksi sekarang dan lihat kontribusi nyata Anda terhadap lingkungan.
          </p>
          <Link href="/consultation">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-4 text-lg font-sans">
              Coba Deteksi Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">HargAI</h3>
              <p className="text-gray-400 font-sans text-sm">
                Sistem deteksi dan audit sampah berbasis AI untuk monitoring pengelolaan sampah secara efisien dan modern.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-gray-400 font-sans text-sm">
                <li><Link href="/consultation" className="hover:text-cyan-400 transition-colors">Deteksi Sampah</Link></li>
                <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Audit & Riwayat</Link></li>
                <li><Link href="/testimonials" className="hover:text-cyan-400 transition-colors">Laporan Analitik</Link></li>
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
              <h4 className="text-lg font-serif font-bold mb-4">Teknologi</h4>
              <div className="space-y-2 text-gray-400 font-sans text-sm">
                <p>🤖 AI: YOLOv8</p>
                <p>📊 Real-time Detection</p>
                <p>⚡ Fast Processing</p>
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