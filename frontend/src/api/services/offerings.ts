import api from "@/api/axios"
import { extractListResults, fetchAllPages } from "@/lib/api-utils"

export interface Offering {
  id: number
  church: number
  church_name?: string
  mtaa_id?: number
  mtaa_name?: string
  offering_type: number
  offering_type_name?: string
  amount: string
  church_share: string
  field_share: string
  month: number
  year: number
  notes: string
  created_at?: string
}

export interface OfferingFormData {
  church: number
  offering_type: number
  amount: number
  month: number
  year: number
  notes: string
}

export async function fetchOfferings(filters?: {
  mtaa?: number
  church?: number
  offering_type?: number
  month?: number
  year?: number
  search?: string
}): Promise<Offering[]> {
  const params = filters || {}
  try {
    return await fetchAllPages<Offering>((page) =>
      api.get("/offerings/", { params: { ...params, page } })
    )
  } catch {
    const { data } = await api.get("/offerings/", { params })
    return extractListResults<Offering>(data)
  }
}

export async function fetchOfferingTypes(): Promise<any[]> {
  const { data } = await api.get("/offering-types/")
  return extractListResults(data)
}

export async function createOffering(data: OfferingFormData): Promise<Offering> {
  const { data: response } = await api.post("/offerings/", data)
  return response
}

export async function updateOffering(id: number, data: Partial<OfferingFormData>): Promise<Offering> {
  const { data: response } = await api.put(`/offerings/${id}/`, data)
  return response
}

export async function deleteOffering(id: number): Promise<void> {
  await api.delete(`/offerings/${id}/`)
}
