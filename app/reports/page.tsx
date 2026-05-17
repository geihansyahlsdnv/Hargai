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
import { BarChart3, PieChart as PieChartIcon, CalendarRange } from "lucide-react"

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

type DataSource = "backend" | "local" | "none"

const pieColors = ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ef4444", "#64748b"]

function deriveFromLocalStorage(): ReportsSummary | null {
  try {
    const raw = localStorage.getItem("saved_audit_history")
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null

    const labelTotals: Record<string, number> = {}
    const dateTotals: Record<string, number> = {}
    let totalObjects = 0

    for (const item of parsed) {
      const label = String(
        item?.top_label ?? item?.top_prediction ?? item?.label ?? "Tidak diketahui"
      )
      labelTotals[label] = (labelTotals[label] || 0) + 1

      const detections = Array.isArray(item?.detections) ? item.detections : []
      totalObjects += detections.length

      const date = new Date(item?.created_at ?? item?.createdAt ?? "")
      if (!Number.isNaN(date.getTime())) {
        const key = date.toISOString().slice(0, 10)
        dateTotals[key] = (dateTotals[key] || 0) + 1
      }
    }

    const category_distribution = Object.entries(labelTotals).map(([label, count]) => ({
      label,
      count,
    }))

    const daily_trend = Object.entries(dateTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }))

    return {
      total_audits: parsed.length,
      total_objects: totalObjects,
      average_confidence: 0,
      category_distribution,
      daily_trend,
    }
  } catch {
    return null
  }
}

export default function ReportsAnalyticsPage() {
  const [summary, setSummary] = useState<ReportsSummary | null>(null)
  const [dataSource, setDataSource] = useState<DataSource>("none")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("access_token")

        const res = await fetch("/api/reports/summary", {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        })

        if (res.ok) {
          const data: ReportsSummary = await res.json()
          setSummary(data)
          setDataSource("backend")
          return
        }
      } catch {
        // backend unreachable — fall through to local
      }

      const local = deriveFromLocalStorage()
      if (local) {
        setSummary(local)
        setDataSource("local")
      } else {
        setDataSource("none")
      }
    }

    load().finally(() => setLoading(false))
  }, [])

  const distributionData = useMemo(() => {
    if (!summary) return []
    return summary.category_distribution.map((entry) => ({
      name: entry.label,
      value: entry.count,
    }))
  }, [summary])

  const trendData = useMemo(() => {
    if (!summary) return []
    return summary.daily_trend.map((entry) => ({
      date: entry.date,
      label: new Date(entry.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      total: entry.count,
    }))
  }, [summary])

  const dominantCategory = useMemo(() => {
    if (!distributionData.length) return "-"
    return [...distributionData].sort((a, b) => b.value - a.value)[0].name
  }, [distributionData])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6">
              Laporan & <span className="text-cyan-600">Analitik</span>
            </h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-slate-500">Memuat data laporan...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6">
            Laporan & <span className="text-cyan-600">Analitik</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {dataSource === "backend"
              ? "Data diambil langsung dari database."
              : dataSource === "local"
              ? "Data dari riwayat lokal. Backend tidak tersedia."
              : "Belum ada data audit."}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Total Audit</p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {summary?.total_audits ?? 0}
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Total Objek</p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {summary?.total_objects ?? 0}
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Rata-rata Confidence</p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {summary && summary.average_confidence > 0
                    ? `${(summary.average_confidence * 100).toFixed(1)}%`
                    : "-"}
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Kategori Dominan</p>
                <h3 className="text-2xl font-bold text-slate-900 break-words">
                  {dominantCategory}
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Kategori Unik</p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {distributionData.length}
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {!summary || distributionData.length === 0 ? (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 text-lg">
                  Belum ada data audit untuk dianalisis.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Distribusi Kategori
                </CardTitle>
                <CardDescription>
                  Jumlah audit per kategori sampah.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Jumlah Audit"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <PieChartIcon className="w-5 h-5 text-cyan-600" />
                  Proporsi Kategori
                </CardTitle>
                <CardDescription>
                  Distribusi proporsi tiap kategori sampah.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {distributionData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <CalendarRange className="w-5 h-5 text-violet-600" />
                  Tren Audit 7 Hari Terakhir
                </CardTitle>
                <CardDescription>
                  Jumlah audit per hari dari backend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Jumlah Audit"
                        stroke="#10b981"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}