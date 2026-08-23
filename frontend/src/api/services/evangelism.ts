import api from "@/api/axios"
import { extractListResults, fetchAllPages } from "@/lib/api-utils"

export interface EvangelismRecord {
  id: number
  church: number
  church_name?: string
  mtaa_id?: number
  mtaa_name?: string
  month: number
  year: number
  baptized: number
  converted: number
  visited: number
  supported: number
  comments: string
  created_at?: string
}

export interface EvangelismFormData {
  church: number
  month: number
  year: number
  baptized: number
  converted: number
  visited: number
  supported: number
  comments: string
}

export async function fetchEvangelismRecords(filters?: {
  mtaa?: number
  church?: number
  month?: number
  year?: number
  search?: string
}): Promise<EvangelismRecord[]> {
  const params = filters || {}
  try {
    return await fetchAllPages<EvangelismRecord>((page) =>
      api.get("/evangelism/", { params: { ...params, page } })
    )
  } catch {
    const { data } = await api.get("/evangelism/", { params })
    return extractListResults<EvangelismRecord>(data)
  }
}

export async function createEvangelismRecord(data: EvangelismFormData): Promise<EvangelismRecord> {
  const { data: response } = await api.post("/evangelism/", data)
  return response
}

export async function updateEvangelismRecord(id: number, data: Partial<EvangelismFormData>): Promise<EvangelismRecord> {
  const { data: response } = await api.put(`/evangelism/${id}/`, data)
  return response
}

export async function deleteEvangelismRecord(id: number): Promise<void> {
  await api.delete(`/evangelism/${id}/`)
}
