export interface Mtaa {
  id: number
  name: string
  jimbo: number
  jimbo_name?: string
  leader_name: string
  phone: string
  location: string
  is_active: boolean
  church_count?: number
}

export interface Church {
  id: number
  name: string
  mtaa: number
  mtaa_name?: string
  jimbo_name?: string
  pastor_name: string
  phone: string
  address?: string
  member_count: number
  is_active: boolean
}

export interface OrganizationLookup {
  mitaa: Mtaa[]
  churches: Church[]
  mtaaById: Map<number, Mtaa>
  churchById: Map<number, Church>
  churchesByMtaa: Map<number, Church[]>
  loading: boolean
  error: string | null
  getMtaaName: (id?: number | null) => string
  getChurchName: (id?: number | null) => string
  getChurchesForMtaa: (mtaaId?: number | null) => Church[]
}
