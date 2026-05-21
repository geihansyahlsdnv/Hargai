"use client"

import { useEffect, useState, useCallback } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStoredUser, getStoredToken } from "@/lib/auth"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
  ScanLine, LayoutGrid, TrendingUp, Users,
  Pencil, Trash2, ArrowRight, Clock, CheckCircle,
} from "lucide-react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
  id: string | number
  username: string
  email: string
  role: string
}

type AuditHistory = {
  audit_id: string
  image_url: string
  top_label: string
  total_detections: number
  average_confidence: number
  created_at: string
}

type CategoryItem = { label: string; count: number }
type DailyItem   = { date: string; count: number }

type Stats = {
  total_audits: number
  total_objects: number
  average_confidence: number
  category_distribution: CategoryItem[]
  daily_trend: DailyItem[]
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const CAT_COLORS = [
  "#0891b2","#f59e0b","#10b981","#ef4444",
  "#8b5cf6","#ec4899","#84cc16","#f97316",
]

// ─── Stat Card (matches HomePage card style) ──────────────────────────────────

function StatCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-sans font-semibold text-gray-500 uppercase tracking-wide">
            {label}
          </CardTitle>
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <span className="text-cyan-600">{icon}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-serif font-black text-gray-900 leading-none">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 font-sans mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditUserModal({
  user, onClose, onSaved,
}: { user: User; onClose: () => void; onSaved: (u: User) => void }) {
  const [username, setUsername] = useState(user.username)
  const [email, setEmail]       = useState(user.email)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const handleSave = async () => {
    setLoading(true); setError("")
    try {
      const token = getStoredToken()
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, email }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || "Gagal memperbarui profil")
      }
      const updated = await res.json()
      localStorage.setItem("user", JSON.stringify({ ...user, ...updated }))
      onSaved({ ...user, ...updated })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-8">
        <h2 className="text-2xl font-serif font-black text-gray-900 mb-6">Edit Profil</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-sans font-semibold text-gray-600 block mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="text-sm font-sans font-semibold text-gray-600 block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 font-sans">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200 text-gray-600 font-sans"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteUserModal({
  onClose, onDeleted,
}: { onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const handleDelete = async () => {
    setLoading(true); setError("")
    try {
      const token = getStoredToken()
      const res = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || "Gagal menghapus akun")
      }
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      onDeleted()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-serif font-black text-gray-900 mb-2">Hapus Akun</h2>
        <p className="text-gray-600 font-sans text-sm mb-6">
          Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
        </p>
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 font-sans mb-4">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 text-gray-600 font-sans"
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-sans font-bold"
          >
            {loading ? "Menghapus..." : "Hapus Akun"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser]         = useState<User | null>(null)
  const [stats, setStats]       = useState<Stats | null>(null)
  const [history, setHistory]   = useState<AuditHistory[]>([])
  const [loading, setLoading]   = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const stored = getStoredUser()
      if (stored) setUser(stored as unknown as User)

      const token = getStoredToken()
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }

      const [userRes, statsRes, historyRes] = await Promise.allSettled([
        fetch("/api/users/me",         { headers }),
        fetch("/api/reports/summary",  { headers }),
        fetch("/api/history",          { headers }),
      ])

      if (userRes.status === "fulfilled" && userRes.value.ok) {
        const d = await userRes.value.json()
        setUser(d)
        localStorage.setItem("user", JSON.stringify(d))
      }
      if (statsRes.status === "fulfilled" && statsRes.value.ok)
        setStats(await statsRes.value.json())
      if (historyRes.status === "fulfilled" && historyRes.value.ok)
        setHistory(await historyRes.value.json())
    } catch {
      // stored user still shown
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const recentActivity = history.slice(0, 5)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

  const confidenceBadge = (c: number) =>
    c >= 0.8
      ? "bg-cyan-100 text-cyan-700"
      : c >= 0.6
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-600"

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {showEdit && user && (
        <EditUserModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={(u) => { setUser(u); setShowEdit(false) }}
        />
      )}
      {showDelete && (
        <DeleteUserModal
          onClose={() => setShowDelete(false)}
          onDeleted={() => { window.location.href = "/login" }}
        />
      )}

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm font-sans font-semibold text-cyan-600 uppercase tracking-widest mb-2">
                Pusat Monitoring
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-3">
                Selamat Datang{" "}
                {user && (
                  <span className="text-cyan-600">&mdash; {user.username}</span>
                )}
              </h1>
              <p className="text-lg text-gray-600 font-sans max-w-xl">
                Ringkasan data deteksi &amp; audit sampah secara real-time untuk monitoring sistem yang efisien.
              </p>
            </div>

            {/* User info card with edit / delete */}
            {user && (
              <div className="flex-shrink-0">
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-5 pb-4 px-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-serif font-black text-xl">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-serif font-bold text-gray-900">{user.username}</p>
                        <p className="text-xs font-sans text-cyan-600 uppercase font-semibold">{user.role}</p>
                        <p className="text-xs font-sans text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowEdit(true)}
                          className="border-cyan-200 text-cyan-600 hover:bg-cyan-50 h-8 px-3 font-sans text-xs"
                        >
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDelete(true)}
                          className="border-red-200 text-red-500 hover:bg-red-50 h-8 px-3 font-sans text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<LayoutGrid className="h-5 w-5" />}
                label="Total Audit"
                value={stats?.total_audits ?? history.length}
                sub="sesi deteksi"
              />
              <StatCard
                icon={<ScanLine className="h-5 w-5" />}
                label="Objek Terdeteksi"
                value={stats?.total_objects ?? "—"}
                sub="total objek"
              />
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Kategori Sampah"
                value={stats?.category_distribution?.length ?? "—"}
                sub="jenis berbeda"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Avg Confidence"
                value={
                  stats?.average_confidence
                    ? `${(stats.average_confidence * 100).toFixed(0)}%`
                    : "—"
                }
                sub="confidence score"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-3">
              Grafik Ringkasan
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Visualisasi data deteksi sampah untuk memahami pola pengelolaan secara lebih intuitif.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Trend */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-serif font-bold text-gray-900">
                  Tren Deteksi 7 Hari Terakhir
                </CardTitle>
                <p className="text-sm text-gray-500 font-sans">Jumlah audit per hari</p>
              </CardHeader>
              <CardContent>
                {stats?.daily_trend?.length ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stats.daily_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "sans-serif" }}
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
                        }
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                        labelFormatter={(v) =>
                          new Date(v).toLocaleDateString("id-ID", {
                            weekday: "long", day: "2-digit", month: "long",
                          })
                        }
                      />
                      <Line
                        type="monotone" dataKey="count" name="Audit"
                        stroke="#0891b2" strokeWidth={3}
                        dot={{ fill: "#0891b2", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm font-sans">
                    Belum ada data tren
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-serif font-bold text-gray-900">
                  Distribusi Kategori Sampah
                </CardTitle>
                <p className="text-sm text-gray-500 font-sans">Jumlah deteksi per kategori</p>
              </CardHeader>
              <CardContent>
                {stats?.category_distribution?.length ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={stats.category_distribution}
                      layout="vertical"
                      margin={{ left: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis
                        dataKey="label" type="category"
                        tick={{ fontSize: 11, fill: "#374151" }} width={90}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                      />
                      <Bar dataKey="count" name="Jumlah" radius={[0, 6, 6, 0]}>
                        {stats.category_distribution.map((_, i) => (
                          <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm font-sans">
                    Belum ada data kategori
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Recent Activity ──────────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-black text-gray-900 mb-2">
                Aktivitas Terbaru
              </h2>
              <p className="text-gray-600 font-sans">
                5 deteksi terakhir yang dilakukan
              </p>
            </div>
            <Link href="/history">
              <Button
                variant="outline"
                className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-sans font-bold"
              >
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-sans">Belum ada aktivitas deteksi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentActivity.map((item) => (
                <Card
                  key={item.audit_id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="py-4 px-6">
                    <div className="flex items-center gap-5">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.top_label}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                            🖼️
                          </div>
                        )}
                      </div>

                      {/* Label + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-gray-900 capitalize text-base">
                          {item.top_label}
                        </p>
                        <p className="text-sm text-gray-500 font-sans mt-0.5">
                          {item.total_detections} objek &bull; {formatDate(item.created_at)}
                        </p>
                      </div>

                      {/* Confidence */}
                      <span
                        className={`text-xs font-sans font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${confidenceBadge(item.average_confidence)}`}
                      >
                        {(item.average_confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Navigation ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-3">
              Navigasi Cepat
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Akses fitur utama sistem dengan mudah dan langsung dari dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                href: "/detect",
                icon: <ScanLine className="h-8 w-8 text-cyan-600" />,
                bg: "bg-cyan-100",
                title: "Deteksi Sampah",
                desc: "Upload gambar atau gunakan kamera untuk mendeteksi dan mengklasifikasi jenis sampah secara otomatis.",
              },
              {
                href: "/history",
                icon: <LayoutGrid className="h-8 w-8 text-amber-600" />,
                bg: "bg-amber-100",
                title: "Riwayat Deteksi",
                desc: "Lihat riwayat lengkap semua hasil deteksi yang telah dilakukan sebelumnya.",
              },
              {
                href: "/reports",
                icon: <TrendingUp className="h-8 w-8 text-cyan-600" />,
                bg: "bg-cyan-100",
                title: "Laporan Analitik",
                desc: "Analisis mendalam dengan grafik dan statistik lengkap untuk monitoring pengelolaan sampah.",
              },
            ].map((nav) => (
              <Card
                key={nav.href}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${nav.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {nav.icon}
                  </div>
                  <CardTitle className="text-xl font-serif font-bold">
                    {nav.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-sans mb-6">{nav.desc}</p>
                  <Link href={nav.href}>
                    <Button
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-sans font-bold w-full"
                    >
                      Buka Fitur <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manfaat ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-black text-gray-900 mb-6">
                Monitoring Sistem Secara Efisien
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
                Dashboard ini dirancang sebagai pusat kontrol untuk memantau seluruh aktivitas deteksi dan audit sampah sehingga pengguna dapat melakukan analisis awal sebelum masuk ke halaman yang lebih detail.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Data Real-time", desc: "Informasi terbaru langsung dari sistem tanpa perlu membuka halaman audit secara terpisah." },
                  { title: "Visualisasi Intuitif", desc: "Grafik dan statistik yang mudah dipahami untuk semua tingkat pengguna." },
                  { title: "Navigasi Efisien", desc: "Akses semua fitur utama hanya dengan satu klik dari dashboard." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-50 to-gray-50 rounded-lg p-8 shadow-xl">
                <div className="space-y-4">
                  {[
                    { label: "Plastik", pct: 75, color: "bg-cyan-500" },
                    { label: "Kertas", pct: 52, color: "bg-amber-400" },
                    { label: "Logam", pct: 38, color: "bg-emerald-500" },
                    { label: "Organik", pct: 61, color: "bg-orange-400" },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-sm font-sans mb-1">
                        <span className="font-semibold text-gray-700">{bar.label}</span>
                        <span className="text-gray-400">{bar.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.color}`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 font-sans text-center pt-2">
                    Contoh distribusi kategori sampah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (matches HomePage) ────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">HargAI</h3>
              <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-2xl">
                HargAI adalah platform klasifikasi sampah berbasis AI yang membantu pengguna mengenali jenis sampah dan melihat estimasi harga secara cepat.
              </p>
            </div>
            <div className="md:text-right">
              <h4 className="text-lg font-serif font-bold mb-4">Mulai Menggunakan</h4>
              <p className="text-gray-400 font-sans text-sm mb-4">Daftar akun untuk mengakses fitur.</p>
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