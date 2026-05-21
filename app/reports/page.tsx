"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import {
  BarChart3,
  PieChart as PieChartIcon,
  CalendarRange,
  Download,
  RefreshCw,
  TrendingUp,
  Package,
  Target,
  Layers,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type CategoryEntry = {
  label: string
  count: number
}

type DailyEntry = {
  date: string
  count: number
}

type ReportsSummary = {
  total_audits: number
  total_objects: number
  average_confidence: number
  category_distribution: CategoryEntry[]
  daily_trend: DailyEntry[]
}

const PIE_COLORS = [
  "#10b981",
  "#06b6d4",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#64748b",
  "#f97316",
  "#ec4899",
]

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-xl p-3 text-sm">
      <p className="font-serif font-bold text-gray-900 mb-1">{label}</p>
      <p className="text-cyan-600 font-semibold">
        {payload[0].value} audit
      </p>
    </div>
  )
}

function CustomLineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-xl p-3 text-sm">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      <p className="text-emerald-600 font-semibold">
        {payload[0].value} audit
      </p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-xl p-3 text-sm">
      <p className="font-serif font-bold text-gray-900 mb-1">
        {payload[0].name}
      </p>
      <p className="text-violet-600 font-semibold">
        {payload[0].value} audit
      </p>
      <p className="text-gray-400 text-xs">
        {payload[0].payload.percent?.toFixed(1)}%
      </p>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  accent: string
}) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className={`p-2 rounded-xl ${accent} w-fit mb-4`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-serif font-bold text-gray-900 break-words">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function FilterBar({
  activeRange,
  onRangeChange,
  onRefresh,
  onExport,
  loading,
}: {
  activeRange: string
  onRangeChange: (r: string) => void
  onRefresh: () => void
  onExport: () => void
  loading: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {[
          { label: "7 Hari", value: "7d" },
          { label: "30 Hari", value: "30d" },
          { label: "Semua", value: "all" },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeRange === range.value
                ? "bg-cyan-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Perbarui
        </Button>

        <Button
          onClick={onExport}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Laporan
        </Button>
      </div>
    </div>
  )
}

export default function ReportsAnalyticsPage() {
  const [summary, setSummary] = useState<ReportsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeRange, setActiveRange] = useState("7d")

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("access_token")

      const res = await fetch("/api/reports/summary", {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
        cache: "no-store",
      })

      if (!res.ok) {
        setError(`Gagal memuat data laporan (${res.status}).`)
        setSummary(null)
        return
      }

      const data: ReportsSummary = await res.json()
      setSummary(data)
    } catch {
      setError("Backend tidak dapat dihubungi.")
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const distributionData = useMemo(() => {
    if (!summary) return []

    const categories = Array.isArray(summary.category_distribution)
      ? summary.category_distribution
      : []

    const total = categories.reduce((sum, entry) => {
      return sum + Number(entry.count ?? 0)
    }, 0)

    return categories.map((entry) => ({
      name: entry.label,
      value: Number(entry.count ?? 0),
      percent: total > 0 ? (Number(entry.count ?? 0) / total) * 100 : 0,
    }))
  }, [summary])

  const trendData = useMemo(() => {
    if (!summary) return []

    let entries = Array.isArray(summary.daily_trend)
      ? summary.daily_trend
      : []

    if (activeRange === "7d") {
      entries = entries.slice(-7)
    } else if (activeRange === "30d") {
      entries = entries.slice(-30)
    }

    return entries.map((entry) => ({
      label: new Date(`${entry.date}T00:00:00`).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      total: Number(entry.count ?? 0),
    }))
  }, [summary, activeRange])

  const dominantCategory = useMemo(() => {
    if (!distributionData.length) return null

    return [...distributionData].sort((a, b) => b.value - a.value)[0].name
  }, [distributionData])

  const trendDelta = useMemo(() => {
    if (trendData.length < 2) return null

    const last = trendData[trendData.length - 1].total
    const prev = trendData[trendData.length - 2].total

    if (prev === 0) return null

    const pct = Math.round(((last - prev) / prev) * 100)

    return {
      pct,
      direction: pct >= 0 ? "up" : "down",
    } as const
  }, [trendData])

  const hasSummary = !!summary
  const hasCategoryData = distributionData.length > 0
  const hasTrendData = trendData.length > 0
  const hasChartData = hasCategoryData || hasTrendData

  const handleExport = () => {
    if (!summary) return

    const blob = new Blob(
      [
        JSON.stringify(
          {
            exported_at: new Date().toISOString(),
            summary,
          },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = `laporan-analitik-${Date.now()}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4">
              Laporan &amp; <span className="text-cyan-600">Analitik</span>
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-10 text-center">
              <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Memuat data laporan...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4">
            Laporan &amp; <span className="text-cyan-600">Analitik</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualisasi data hasil audit sampah dari seluruh sesi deteksi.
          </p>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-red-700 text-sm font-semibold">
              {error}
            </p>

            <Button
              onClick={fetchData}
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      )}

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Audit"
            value={summary?.total_audits ?? 0}
            icon={<FileText className="w-5 h-5 text-cyan-600" />}
            accent="bg-cyan-50"
          />

          <StatCard
            label="Total Objek Terdeteksi"
            value={summary?.total_objects ?? 0}
            icon={<Package className="w-5 h-5 text-violet-600" />}
            accent="bg-violet-50"
          />

          <StatCard
            label="Rata-rata Confidence"
            value={
              summary && summary.average_confidence > 0
                ? `${(summary.average_confidence * 100).toFixed(1)}%`
                : "-"
            }
            icon={<Target className="w-5 h-5 text-amber-600" />}
            accent="bg-amber-50"
          />

          <StatCard
            label="Kategori Unik"
            value={distributionData.length}
            icon={<Layers className="w-5 h-5 text-emerald-600" />}
            accent="bg-emerald-50"
          />
        </div>
      </section>

      {dominantCategory && (
        <section className="pb-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-500 p-5 flex items-center justify-between gap-4 shadow-md">
              <div>
                <p className="text-cyan-100 text-xs font-semibold uppercase tracking-widest mb-1">
                  Kategori Paling Banyak Terdeteksi
                </p>

                <p className="text-white text-2xl font-serif font-bold">
                  {dominantCategory}
                </p>
              </div>

              <TrendingUp className="w-10 h-10 text-white/40 shrink-0" />
            </div>
          </div>
        </section>
      )}

      {!hasSummary || !hasChartData ? (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-200 mx-auto mb-4" />

                <p className="text-gray-500 text-lg mb-4">
                  {error
                    ? "Data tidak dapat dimuat dari server."
                    : "Belum ada data audit untuk dianalisis."}
                </p>

                {!error && (
                  <Link href="/classify">
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      Mulai Deteksi
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <FilterBar
              activeRange={activeRange}
              onRangeChange={setActiveRange}
              onRefresh={fetchData}
              onExport={handleExport}
              loading={loading}
            />

            {hasCategoryData && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="w-5 h-5 text-cyan-600" />
                      Distribusi Kategori
                    </CardTitle>

                    <CardDescription>
                      Jumlah audit per kategori sampah.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="h-[340px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={distributionData}
                          margin={{
                            top: 4,
                            right: 8,
                            left: 0,
                            bottom: 4,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />

                          <XAxis
                            dataKey="name"
                            tick={{
                              fontSize: 12,
                              fill: "#64748b",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            allowDecimals={false}
                            tick={{
                              fontSize: 12,
                              fill: "#64748b",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <Tooltip content={<CustomBarTooltip />} />

                          <Bar
                            dataKey="value"
                            name="Jumlah Audit"
                            radius={[8, 8, 0, 0]}
                          >
                            {distributionData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <PieChartIcon className="w-5 h-5 text-violet-600" />
                      Proporsi Kategori
                    </CardTitle>

                    <CardDescription>
                      Distribusi proporsi tiap kategori.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="h-[340px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="45%"
                            outerRadius={110}
                            innerRadius={48}
                            dataKey="value"
                            nameKey="name"
                            paddingAngle={2}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {distributionData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>

                          <Tooltip content={<CustomPieTooltip />} />

                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{
                              fontSize: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {hasTrendData && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <CalendarRange className="w-5 h-5 text-emerald-600" />
                        Tren Audit per Hari
                      </CardTitle>

                      <CardDescription>
                        {activeRange === "7d"
                          ? "7 hari terakhir"
                          : activeRange === "30d"
                            ? "30 hari terakhir"
                            : "Semua periode"}{" "}
                        berdasarkan jumlah audit harian.
                      </CardDescription>
                    </div>

                    {trendDelta && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                          trendDelta.direction === "up"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {trendDelta.direction === "up" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}

                        {Math.abs(trendDelta.pct)}% vs kemarin
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{
                          top: 4,
                          right: 16,
                          left: 0,
                          bottom: 4,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                        />

                        <XAxis
                          dataKey="label"
                          tick={{
                            fontSize: 12,
                            fill: "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          tick={{
                            fontSize: 12,
                            fill: "#64748b",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip content={<CustomLineTooltip />} />

                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            fontSize: "12px",
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Jumlah Audit"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            fill: "#10b981",
                            strokeWidth: 0,
                          }}
                          activeDot={{
                            r: 7,
                            fill: "#059669",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasCategoryData && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Layers className="w-5 h-5 text-amber-600" />
                    Ringkasan Per Kategori
                  </CardTitle>

                  <CardDescription>
                    Detail jumlah dan proporsi setiap kategori sampah.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                            Kategori
                          </th>
                          <th className="text-center py-3 px-4 text-gray-500 font-semibold">
                            Jumlah
                          </th>
                          <th className="text-center py-3 px-4 text-gray-500 font-semibold">
                            Proporsi
                          </th>
                          <th className="py-3 px-4" />
                        </tr>
                      </thead>

                      <tbody>
                        {[...distributionData]
                          .sort((a, b) => b.value - a.value)
                          .map((entry, index) => (
                            <tr
                              key={entry.name}
                              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{
                                      background:
                                        PIE_COLORS[
                                          index % PIE_COLORS.length
                                        ],
                                    }}
                                  />

                                  <span className="font-semibold text-gray-900">
                                    {entry.name}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-center font-bold text-gray-900">
                                {entry.value}
                              </td>

                              <td className="py-3 px-4 text-center text-gray-600">
                                {entry.percent.toFixed(1)}%
                              </td>

                              <td className="py-3 px-4">
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${entry.percent}%`,
                                      background:
                                        PIE_COLORS[
                                          index % PIE_COLORS.length
                                        ],
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <FileText className="h-14 w-14 text-cyan-600 mx-auto mb-4" />

              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                Riwayat Deteksi
              </h3>

              <p className="text-gray-600 mb-6">
                Lihat seluruh rekam jejak hasil deteksi secara kronologis.
              </p>

              <Link href="/history">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  Buka Riwayat
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Download className="h-14 w-14 text-emerald-600 mx-auto mb-4" />

              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                Export Laporan
              </h3>

              <p className="text-gray-600 mb-6">
                Unduh data laporan lengkap dalam format JSON.
              </p>

              <Button
                onClick={handleExport}
                disabled={!summary}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Export Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif font-black text-cyan-400 mb-3">
                HargAI
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                HargAI adalah platform klasifikasi sampah berbasis AI yang
                membantu pengguna mengenali jenis sampah dan melihat estimasi
                harga secara cepat.
              </p>
            </div>

            <div className="md:text-right">
              <h4 className="text-lg font-serif font-bold mb-4">
                Mulai Menggunakan
              </h4>

              <p className="text-gray-400 text-sm mb-4">
                Daftar akun untuk mengakses fitur.
              </p>

              <Link href="/register">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  Sign Up / Register
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 HargAI. All rights reserved.
            </p>

            <p className="text-gray-500 text-xs">
              Powered by HargAI Waste Classification System
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}