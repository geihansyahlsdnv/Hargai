"use client"

import { useEffect, useMemo, useState } from "react"
import Navigation from "@/components/navigation"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

type AuditHistoryItem = {
  audit_id: number
  image_url: string
  top_label: string
  created_at: string
}

const pieColors = ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ef4444", "#64748b"]

export default function ReportsAnalyticsPage() {
  const [historyData, setHistoryData] = useState<AuditHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get<AuditHistoryItem[]>("/audits/history")
        setHistoryData(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Gagal mengambil history laporan:", error)
        setHistoryData([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const distributionData = useMemo(() => {
    const totals: Record<string, number> = {}

    historyData.forEach((item) => {
      const label = item.top_label || "Tidak diketahui"
      totals[label] = (totals[label] || 0) + 1
    })

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }))
  }, [historyData])

  const trendData = useMemo(() => {
    const grouped: Record<string, number> = {}

    historyData.forEach((item) => {
      const date = new Date(item.created_at)

      if (Number.isNaN(date.getTime())) return

      const key = date.toISOString().slice(0, 10)
      grouped[key] = (grouped[key] || 0) + 1
    })

    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, total]) => ({
        date,
        label: new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        total,
      }))
  }, [historyData])

  const dominantCategory = useMemo(() => {
    if (!distributionData.length) return "-"

    return [...distributionData].sort((a, b) => b.value - a.value)[0].name
  }, [distributionData])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        <section className="bg-gradient-to-br from-gray-50 to-white py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6">
                Laporan & <span className="text-cyan-600">Analitik</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Analisis audit dari backend AI.
              </p>
            </div>
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6">
              Laporan & <span className="text-cyan-600">Analitik</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Analisis audit dari backend AI.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Total Audit</p>
                <h3 className="text-3xl font-bold text-slate-900">
                  {historyData.length}
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">Kategori Dominan</p>
                <h3 className="text-3xl font-bold text-slate-900">
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

      {historyData.length === 0 ? (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 text-lg">
                  Belum ada data audit untuk ditampilkan.
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
                  Distribusi Top Label
                </CardTitle>
                <CardDescription>
                  Berdasarkan top_label dari endpoint history backend.
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
                  Distribusi kategori berdasarkan top label audit.
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
                  Tren Audit Berdasarkan Waktu
                </CardTitle>
                <CardDescription>
                  Jumlah audit per hari berdasarkan data backend.
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