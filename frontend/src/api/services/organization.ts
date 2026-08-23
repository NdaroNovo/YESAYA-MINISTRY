import api from "@/api/axios"
import { extractListResults } from "@/lib/api-utils"
import type { Church, Mtaa } from "@/types/organization"

export async function fetchMitaa(jimboId?: number): Promise<Mtaa[]> {
  const params = jimboId ? { jimbo: jimboId } : undefined
  const { data } = await api.get("/mitaa/", { params })
  return extractListResults<Mtaa>(data)
}

export async function fetchChurches(mtaaId?: number): Promise<Church[]> {
  const params = mtaaId ? { mtaa: mtaaId } : undefined
  const { data } = await api.get("/churches/", { params })
  return extractListResults<Church>(data)
}

export async function fetchAllMitaa(): Promise<Mtaa[]> {
  return fetchMitaa()
}

export async function fetchAllChurches(): Promise<Church[]> {
  return fetchChurches()
}

export async function generateReport(reportType: string = "all") {
  const { data } = await api.get("/reports/generate/", { params: { type: reportType } })
  return data
}

export function buildOrganizationMaps(mitaa: Mtaa[], churches: Church[]) {
  const mtaaById = new Map(mitaa.map((item) => [item.id, item]))
  const churchById = new Map(churches.map((item) => [item.id, item]))
  const churchesByMtaa = new Map<number, Church[]>()

  for (const church of churches) {
    const existing = churchesByMtaa.get(church.mtaa) ?? []
    existing.push(church)
    churchesByMtaa.set(church.mtaa, existing)
  }

  return { mtaaById, churchById, churchesByMtaa }
}
