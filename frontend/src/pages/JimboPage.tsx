import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Church, Plus, MapPin } from "lucide-react"
import api from "@/api/axios"
import { extractListResults } from "@/lib/api-utils"
import { fetchMitaa } from "@/api/services/organization"
import { MtaaBadge } from "@/components/OrganizationBadge"
import type { Mtaa } from "@/types/organization"

interface Jimbo {
  id: number
  name: string
  district: string
  region: string
  phone: string
  email: string
  created_at: string
}

export default function JimboPage() {
  const [jimbo, setJimbo] = useState<Jimbo | null>(null)
  const [mitaa, setMitaa] = useState<Mtaa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/jimbo/")
        const results = extractListResults<Jimbo>(data)
        const jimboData = results[0] ?? null
        if (jimboData) setJimbo(jimboData)
        const mitaaData = await fetchMitaa(jimboData?.id)
        setMitaa(mitaaData)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p className="text-muted-foreground">Inapakia...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Jimbo Information</h1>
          <p className="text-sm text-muted-foreground">Taarifa za Jimbo na Mitaa yake</p>
        </div>
        {!jimbo && (
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" /> Ongeza Jimbo
          </Button>
        )}
      </div>

      {jimbo ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="w-5 h-5 text-gold" />
                {jimbo.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Wilaya</p>
                <p className="font-medium">{jimbo.district || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mkoa</p>
                <p className="font-medium">{jimbo.region || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Simu</p>
                <p className="font-medium">{jimbo.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barua pepe</p>
                <p className="font-medium">{jimbo.email || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
                Mitaa ya Jimbo ({mitaa.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mitaa.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mitaa.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between gap-2">
                        <MtaaBadge name={item.name} />
                        <span className="text-xs text-muted-foreground">
                          {item.church_count ?? 0} makanisa
                        </span>
                      </div>
                      {item.leader_name && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Kiongozi: {item.leader_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Hakuna mitaa bado chini ya jimbo hili.</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Church className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Hakuna taarifa za Jimbo bado. Ongeza kupitia Django Admin.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
