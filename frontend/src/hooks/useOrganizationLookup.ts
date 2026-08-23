import { useEffect, useMemo, useState } from "react"
import {
  buildOrganizationMaps,
  fetchAllChurches,
  fetchAllMitaa,
} from "@/api/services/organization"
import type { Church, Mtaa, OrganizationLookup } from "@/types/organization"

const EMPTY_LOOKUP: OrganizationLookup = {
  mitaa: [],
  churches: [],
  mtaaById: new Map(),
  churchById: new Map(),
  churchesByMtaa: new Map(),
  loading: true,
  error: null,
  getMtaaName: () => "—",
  getChurchName: () => "—",
  getChurchesForMtaa: () => [],
}

export function useOrganizationLookup(): OrganizationLookup {
  const [mitaa, setMitaa] = useState<Mtaa[]>([])
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [mitaaData, churchData] = await Promise.all([
          fetchAllMitaa(),
          fetchAllChurches(),
        ])
        if (!cancelled) {
          setMitaa(mitaaData)
          setChurches(churchData)
        }
      } catch {
        if (!cancelled) {
          setError("Imeshindwa kupakia Mitaa na Makanisa.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    const { mtaaById, churchById, churchesByMtaa } = buildOrganizationMaps(mitaa, churches)

    return {
      mitaa,
      churches,
      mtaaById,
      churchById,
      churchesByMtaa,
      loading,
      error,
      getMtaaName: (id?: number | null) => {
        if (!id) return "—"
        return mtaaById.get(id)?.name ?? `Mtaa #${id}`
      },
      getChurchName: (id?: number | null) => {
        if (!id) return "—"
        return churchById.get(id)?.name ?? `Kanisa #${id}`
      },
      getChurchesForMtaa: (mtaaId?: number | null) => {
        if (!mtaaId) return churches
        return churchesByMtaa.get(mtaaId) ?? []
      },
    }
  }, [mitaa, churches, loading, error])
}

export { EMPTY_LOOKUP }
