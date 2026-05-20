"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  ScanLine,
  Wallet,
  LayoutGrid,
  Cpu,
  Camera,
  BarChart3,
  ChevronDown,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.94); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.6; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(6px); opacity: 0.5; }
        }
        @keyframes gridFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .animate-blob       { animation: blob 9s infinite ease-in-out; }
        .animate-blob-delay { animation: blob 11s infinite ease-in-out 3s; }
        .animate-float      { animation: float 4s ease-in-out infinite; }

        .fade-up   { animation: fadeInUp   0.7s ease both; }
        .fade-left { animation: fadeInLeft 0.7s ease both; }
        .fade-right{ animation: fadeInRight 0.7s ease both; }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }
        .delay-4 { animation-delay: 0.5s; }
        .delay-5 { animation-delay: 0.65s; }

        .hero-grid {
          background-image:
            linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridFade 1.2s ease both;
        }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #0891b2 0%, #06b6d4 30%, #67e8f9 50%, #06b6d4 70%, #0891b2 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-hover {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 24px 48px -12px rgba(8,145,178,0.18);
          border-color: rgba(8,145,178,0.35) !important;
        }
        .card-hover:hover .icon-wrap { background: rgba(8,145,178,0.15); }
        .card-hover:hover .icon-wrap svg { transform: scale(1.15) rotate(-5deg); }

        .icon-wrap svg { transition: transform 0.3s ease; }

        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(8,145,178,0.25);
          animation: pulse-ring 2.4s ease-out infinite;
        }

        .btn-primary-glow {
          box-shadow: 0 0 0 0 rgba(8,145,178,0);
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .btn-primary-glow:hover {
          box-shadow: 0 0 24px 4px rgba(8,145,178,0.35);
          transform: translateY(-2px);
        }

        .stat-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(8,145,178,0.15);
        }

        .check-item {
          transition: transform 0.25s ease;
        }
        .check-item:hover { transform: translateX(4px); }

        .step-num {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
        }

        .scroll-cue {
          animation: scroll-bounce 1.8s ease-in-out infinite;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(8,145,178,0.25), transparent);
        }

        .cta-bg {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 60%, #164e63 100%);
        }

        .image-frame {
          position: relative;
        }
        .image-frame::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(8,145,178,0.25), transparent 60%);
          z-index: 0;
        }
        .image-frame img { position: relative; z-index: 1; }

        .badge-float {
          animation: float 3.5s ease-in-out infinite;
        }

        .amber-card-hover:hover .icon-wrap { background: rgba(217,119,6,0.15); }
      `}</style>

      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navigation />

        {/* ── HERO ── */}
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 py-28 overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute top-[-80px] left-[-80px] w-[480px] h-[480px] rounded-full bg-cyan-200/30 blur-3xl animate-blob pointer-events-none" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full bg-cyan-300/20 blur-3xl animate-blob-delay pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-amber-100/20 blur-3xl pointer-events-none" />

          {/* Grid overlay */}
          <div className="absolute inset-0 hero-grid pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Floating badge */}
            <div className="flex justify-center mb-8 fade-up">
              <div className="badge-float inline-flex items-center gap-2 bg-white border border-cyan-200 rounded-full px-4 py-2 shadow-md text-sm font-sans text-cyan-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                Powered by YOLOv8 Computer Vision
              </div>
            </div>

            <div className="text-center">
              <h1 className="fade-up delay-1 text-5xl md:text-6xl lg:text-7xl font-serif font-black text-gray-900 mb-6 leading-tight">
                Klasifikasi Sampah Digital &{" "}
                <span className="shimmer-text">AI Modern</span>
              </h1>

              <p className="fade-up delay-2 text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
                Solusi berbasis Artificial Intelligence untuk membantu pengguna
                mengenali jenis sampah secara otomatis melalui kamera maupun
                unggahan gambar — cepat, praktis, dan mudah digunakan.
              </p>

              <div className="fade-up delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/classify">
                  <Button
                    size="lg"
                    className="btn-primary-glow bg-cyan-600 hover:bg-cyan-700 text-white px-9 py-6 text-lg rounded-xl"
                  >
                    Mulai Klasifikasi
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400 px-9 py-6 text-lg rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300"
                  >
                    Tentang Kami
                  </Button>
                </Link>
              </div>

              {/* Stat pills */}
              <div className="fade-up delay-4 flex flex-wrap justify-center gap-4">
                {[
                  { label: "Deteksi Otomatis", value: "AI", color: "cyan" },
                  { label: "Analisis Cepat", value: "Fast", color: "amber" },
                  { label: "Mudah Digunakan", value: "Easy", color: "cyan" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`stat-card flex items-center gap-3 bg-white border ${
                      s.color === "cyan" ? "border-cyan-100" : "border-amber-100"
                    } rounded-2xl px-6 py-3 shadow-sm`}
                  >
                    <span
                      className={`text-2xl font-serif font-black ${
                        s.color === "cyan" ? "text-cyan-600" : "text-amber-500"
                      }`}
                    >
                      {s.value}
                    </span>
                    <span className="text-sm text-gray-500 font-sans">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll cue */}
            <div className="flex justify-center mt-14">
              <div className="scroll-cue text-cyan-300">
                <ChevronDown className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── ABOUT / TEKNOLOGI ── */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="fade-left">
                <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-5">
                  Tentang Platform
                </span>
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 leading-tight">
                  Teknologi AI untuk{" "}
                  <span className="text-cyan-600">Klasifikasi Sampah</span>
                </h2>
                <p className="text-lg text-gray-500 mb-5 font-sans leading-relaxed">
                  HargAI menggunakan teknologi Computer Vision modern untuk membantu
                  proses identifikasi jenis sampah secara otomatis melalui kamera
                  maupun unggahan gambar.
                </p>
                <p className="text-lg text-gray-500 mb-10 font-sans leading-relaxed">
                  Dengan sistem klasifikasi berbasis AI, pengguna dapat mengetahui
                  kategori sampah dan estimasi nilai ekonominya secara cepat, praktis,
                  dan mudah dipahami.
                </p>

                {/* Mini feature rows */}
                <div className="space-y-4">
                  {[
                    { icon: Cpu, label: "Model YOLOv8 terlatih khusus sampah daur ulang" },
                    { icon: Camera, label: "Deteksi real-time via kamera atau unggahan gambar" },
                    { icon: BarChart3, label: "Estimasi nilai ekonomi otomatis per kategori" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="check-item flex items-center gap-4 bg-gray-50 hover:bg-cyan-50/60 rounded-xl px-5 py-3.5 border border-gray-100 hover:border-cyan-100 transition-all duration-300 cursor-default">
                      <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-cyan-600" />
                      </div>
                      <span className="text-gray-700 font-sans text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fade-right image-frame">
                <img
                  src="/images/gambar-1.jpg"
                  alt="Visualisasi sistem AI HargAI untuk klasifikasi sampah"
                  className="rounded-2xl shadow-2xl w-full object-cover animate-float"
                />
                {/* Decorative corner accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-100 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-100 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── FITUR UTAMA ── */}
        <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 fade-up">
              <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-4">
                Fitur Platform
              </span>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                Fitur Utama HargAI
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-sans">
                Dirancang untuk memberikan pengalaman klasifikasi sampah yang cepat,
                modern, dan mudah digunakan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Deteksi Akurat",
                  desc: "Teknologi AI membantu mengenali jenis sampah secara otomatis dengan proses yang cepat dan akurat.",
                  bg: "bg-cyan-50",
                  iconColor: "text-cyan-600",
                  delay: "delay-1",
                  accent: "cyan",
                },
                {
                  icon: TrendingUp,
                  title: "Estimasi Harga",
                  desc: "Menampilkan estimasi nilai ekonomi berdasarkan kategori sampah yang berhasil dikenali.",
                  bg: "bg-amber-50",
                  iconColor: "text-amber-500",
                  delay: "delay-2",
                  accent: "amber",
                },
                {
                  icon: Users,
                  title: "Mudah Digunakan",
                  desc: "Tampilan sederhana dan modern agar mudah digunakan oleh semua pengguna.",
                  bg: "bg-cyan-50",
                  iconColor: "text-cyan-600",
                  delay: "delay-3",
                  accent: "cyan",
                },
              ].map(({ icon: Icon, title, desc, bg, iconColor, delay, accent }) => (
                <Card
                  key={title}
                  className={`card-hover fade-up ${delay} border border-gray-100 shadow-md bg-white rounded-2xl overflow-hidden group cursor-default`}
                >
                  <div className={`h-1 w-full ${accent === "cyan" ? "bg-gradient-to-r from-cyan-400 to-cyan-600" : "bg-gradient-to-r from-amber-400 to-amber-500"}`} />
                  <CardHeader className="text-center pb-4 pt-8">
                    <div
                      className={`icon-wrap w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5 relative transition-colors duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-serif font-bold">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-gray-500 font-sans text-center text-sm leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (new) ── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-up">
              <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-4">
                Cara Kerja
              </span>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                3 Langkah Sederhana
              </h2>
              <p className="text-gray-500 font-sans max-w-xl mx-auto">
                Dari foto ke hasil klasifikasi — hanya dalam hitungan detik.
              </p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-200 pointer-events-none" style={{ left: "16.7%", right: "16.7%" }} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                  { num: "01", icon: Camera, title: "Ambil / Unggah Foto", desc: "Foto sampah menggunakan kamera atau unggah gambar dari perangkat Anda." },
                  { num: "02", icon: Cpu, title: "AI Menganalisis", desc: "YOLOv8 mendeteksi dan mengklasifikasi jenis sampah secara real-time." },
                  { num: "03", icon: BarChart3, title: "Lihat Hasil & Harga", desc: "Dapatkan kategori sampah beserta estimasi nilai ekonominya seketika." },
                ].map(({ num, icon: Icon, title, desc }, i) => (
                  <div
                    key={num}
                    className={`fade-up delay-${i + 1} flex flex-col items-center text-center group`}
                  >
                    <div className="relative mb-6">
                      <div className="pulse-ring relative w-20 h-20 step-num rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200/50 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="h-9 w-9 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-cyan-400 rounded-full text-xs font-bold text-cyan-600 flex items-center justify-center font-sans">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── KEUNGGULAN UNTUK PENGEPUL ── */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 fade-up">
              <span className="inline-block text-xs font-sans font-semibold tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-4">
                Untuk Pengepul
              </span>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                Keunggulan untuk Pengepul
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-sans">
                Membantu proses pengelolaan dan identifikasi sampah menjadi lebih
                cepat, efisien, dan modern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ScanLine,
                  title: "Identifikasi Cepat",
                  desc: "Membantu pengepul mengenali jenis sampah secara otomatis melalui kamera tanpa proses pengecekan manual yang memakan waktu.",
                  bg: "bg-cyan-50",
                  iconColor: "text-cyan-600",
                  accent: "cyan",
                  delay: "delay-1",
                },
                {
                  icon: Wallet,
                  title: "Estimasi Nilai Sampah",
                  desc: "Sistem membantu menampilkan estimasi harga berdasarkan kategori sampah yang berhasil dikenali oleh AI.",
                  bg: "bg-amber-50",
                  iconColor: "text-amber-500",
                  accent: "amber",
                  delay: "delay-2",
                },
                {
                  icon: LayoutGrid,
                  title: "Pengelolaan Lebih Mudah",
                  desc: "Membantu pengepul memahami kategori sampah dengan tampilan yang sederhana dan mudah digunakan.",
                  bg: "bg-cyan-50",
                  iconColor: "text-cyan-600",
                  accent: "cyan",
                  delay: "delay-3",
                },
              ].map(({ icon: Icon, title, desc, bg, iconColor, accent, delay }) => (
                <Card
                  key={title}
                  className={`card-hover amber-card-hover fade-up ${delay} border border-gray-100 shadow-md bg-white rounded-2xl overflow-hidden group cursor-default`}
                >
                  <div className={`h-1 w-full ${accent === "cyan" ? "bg-gradient-to-r from-cyan-400 to-cyan-600" : "bg-gradient-to-r from-amber-400 to-amber-500"}`} />
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className={`icon-wrap w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-300`}>
                      <Icon className={`h-8 w-8 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-serif font-bold">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-gray-500 font-sans text-center text-sm leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── MANFAAT BAGI PENGEPUL ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="fade-left image-frame order-2 lg:order-1">
                <img
                  src="/images/gambar-5.webp"
                  alt="Pengepul menggunakan sistem AI HargAI"
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-amber-100 rounded-2xl -z-10" />
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-cyan-100 rounded-xl -z-10" />
              </div>

              <div className="fade-right order-1 lg:order-2">
                <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-5">
                  Manfaat Nyata
                </span>
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-5 leading-tight">
                  Manfaat Bagi Pengepul
                </h2>
                <p className="text-lg text-gray-500 mb-10 font-sans leading-relaxed">
                  HargAI membantu proses pengelolaan sampah menjadi lebih praktis
                  dengan teknologi AI yang mampu melakukan klasifikasi otomatis dan
                  menampilkan estimasi nilai ekonomi sampah secara cepat.
                </p>

                <div className="space-y-5">
                  {[
                    {
                      title: "Mempercepat Proses Sortir",
                      desc: "Mengurangi proses identifikasi manual dengan bantuan AI klasifikasi real-time.",
                    },
                    {
                      title: "Informasi Harga Lebih Praktis",
                      desc: "Membantu pengguna mengetahui estimasi nilai ekonomi dari sampah yang berhasil dikenali.",
                    },
                    {
                      title: "Mudah Digunakan",
                      desc: "Tampilan sederhana dan modern sehingga mudah dipahami oleh pengguna umum maupun pengepul.",
                    },
                  ].map(({ title, desc }) => (
                    <div
                      key={title}
                      className="check-item flex items-start gap-4 p-4 rounded-xl hover:bg-cyan-50/60 hover:border-cyan-100 border border-transparent transition-all duration-300 cursor-default"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-gray-500 font-sans text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── PENDEKATAN TEKNOLOGI ── */}
        <section id="philosophy" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-up">
              <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-600 uppercase bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-4">
                Teknologi
              </span>
              <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                Pendekatan Teknologi Kami
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-sans">
                Teknologi AI modern yang membantu proses klasifikasi sampah menjadi
                lebih praktis dan efisien.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="fade-left space-y-5">
                {[
                  {
                    title: "Deteksi Real-time YOLOv8",
                    desc: "Proses identifikasi jenis sampah secara otomatis melalui kamera maupun unggahan gambar.",
                  },
                  {
                    title: "Estimasi Nilai Ekonomi",
                    desc: "Sistem membantu menampilkan estimasi harga berdasarkan kategori sampah yang berhasil dikenali.",
                  },
                  {
                    title: "Pengalaman Pengguna Modern",
                    desc: "Dirancang agar mudah digunakan oleh pengguna umum tanpa memerlukan proses yang rumit.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="check-item flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:border-cyan-100 border border-transparent hover:shadow-md transition-all duration-300 cursor-default"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-500 font-sans text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fade-right image-frame">
                <img
                  src="/images/gambar-2.jpg"
                  alt="Pengguna menggunakan teknologi AI HargAI"
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-100 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA SECTION (new) ── */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="cta-bg rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-cyan-900/20">
              {/* CTA background decorations */}
              <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                <span className="inline-block text-xs font-sans font-semibold tracking-widest text-cyan-200 uppercase bg-white/10 rounded-full px-4 py-1.5 mb-6">
                  Mulai Sekarang
                </span>
                <h2 className="text-4xl font-serif font-black text-white mb-4 leading-tight">
                  Siap Menggunakan HargAI?
                </h2>
                <p className="text-cyan-100 font-sans text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                  Daftar akun gratis dan mulai klasifikasi sampah dengan teknologi AI
                  dalam hitungan detik.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-white text-cyan-700 hover:bg-cyan-50 font-bold px-9 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      Daftar Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">
                  HargAI
                </h3>
                <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-2xl">
                  HargAI adalah platform klasifikasi sampah berbasis AI yang membantu
                  pengguna mengenali jenis sampah dan melihat estimasi harga secara cepat.
                </p>
              </div>

              <div className="md:text-right">
                <h4 className="text-lg font-serif font-bold mb-4">Mulai Menggunakan</h4>
                <p className="text-gray-400 font-sans text-sm mb-4">
                  Daftar akun untuk mengakses fitur.
                </p>
                <Link href="/register">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold btn-primary-glow">
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
    </>
  )
}