import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "https://hargai.site"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
}

function normalizeConfidence(value: unknown): number {
  const n = Number(value)

  if (Number.isNaN(n)) return 0

  return n > 1 ? n / 100 : n
}

function emptySummary() {
  return {
    total_audits: 0,
    total_objects: 0,
    average_confidence: 0,
    category_distribution: [],
    daily_trend: [],
  }
}

function buildSummary(audits: any[]) {
  if (!Array.isArray(audits) || audits.length === 0) {
    return emptySummary()
  }

  const categoryMap = new Map<string, number>()
  const dailyMap = new Map<string, number>()

  let totalObjects = 0
  let confidenceSum = 0
  let confidenceCount = 0

  for (const audit of audits) {
    const detections = Array.isArray(audit?.detections) ? audit.detections : []

    totalObjects += Number(audit?.total_detections ?? detections.length ?? 0)

    const auditConfidence = normalizeConfidence(
      audit?.average_confidence ?? audit?.confidence ?? 0
    )

    if (auditConfidence > 0) {
      confidenceSum += auditConfidence
      confidenceCount += 1
    }

    const date = String(
      audit?.created_at ?? audit?.createdAt ?? audit?.timestamp ?? ""
    ).slice(0, 10)

    if (date) {
      dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1)
    }

    if (detections.length > 0) {
      for (const detection of detections) {
        const label = String(
          detection?.label ??
            detection?.class_name ??
            detection?.name ??
            "Tidak diketahui"
        )

        categoryMap.set(label, (categoryMap.get(label) ?? 0) + 1)
      }
    } else {
      const fallbackLabel =
        audit?.top_label ??
        audit?.label ??
        audit?.top_prediction ??
        audit?.prediction ??
        audit?.category

      if (fallbackLabel) {
        const label = String(fallbackLabel)
        categoryMap.set(label, (categoryMap.get(label) ?? 0) + 1)
      }
    }
  }

  return {
    total_audits: audits.length,
    total_objects: totalObjects,
    average_confidence:
      confidenceCount > 0 ? confidenceSum / confidenceCount : 0,
    category_distribution: Array.from(categoryMap.entries()).map(
      ([label, count]) => ({
        label,
        count,
      })
    ),
    daily_trend: Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        count,
      })),
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/audits/history`, {
      method: "GET",
      headers: {
        Authorization: auth || "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(emptySummary(), {
        status: response.status,
        headers: noStoreHeaders,
      })
    }

    const data = await response.json()
    const audits = Array.isArray(data) ? data : []

    return NextResponse.json(buildSummary(audits), {
      status: 200,
      headers: noStoreHeaders,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Backend reports tidak dapat dijangkau.",
        detail: error?.message || "Unknown error",
        ...emptySummary(),
      },
      {
        status: 503,
        headers: noStoreHeaders,
      }
    )
  }
}