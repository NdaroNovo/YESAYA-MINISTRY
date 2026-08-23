import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Church } from "lucide-react"
import { fetchMitaa } from "@/api/services/organization"
import OrganizationFilters from "@/components/OrganizationFilters"
import { MtaaBadge } from "@/components/OrganizationBadge"
import { useOrganizationLookup } from "@/hooks/useOrganizationLookup"
import type { Mtaa } from "@/types/organization"

export default function MitaaPage() {
  const { churches, loading: lookupLoading } = useOrganizationLookup()
  const [mitaa, setMitaa] = useState<Mtaa[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMtaa, setSelectedMtaa] = useState<number | "">("")

  useEffect(() => {
    fetchMitaa()
      .then(setMitaa)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredMitaa = useMemo(() => {
    if (!selectedMtaa) return mitaa
    return mitaa.filter((item) => item.id === selectedMtaa)
  }, [mitaa, selectedMtaa])

  const churchCountByMtaa = useMemo(() => {
    const counts = new Map<number, number>()
    for (const church of churches) {
      counts.set(church.mtaa, (counts.get(church.mtaa) ?? 0) + 1)
    }
    return counts
  }, [churches])

  if (loading || lookupLoading) return <p className="text-muted-foreground">Inapakia...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mitaa Management</h1>
          <p className="text-sm text-muted-foreground">
            Mitaa yote ({mitaa.length}) — kila mtaa una makanisa yake
          </p>
        </div>
        <Button variant="gold">
          <Plus className="w-4 h-4 mr-2" /> Ongeza Mtaa
        </Button>
      </div>

      <OrganizationFilters
        mitaa={mitaa}
        churches={churches}
        selectedMtaa={selectedMtaa}
        selectedChurch=""
        onMtaaChange={setSelectedMtaa}
        onChurchChange={() => {}}
        filteredChurches={[]}
      />

      {filteredMitaa.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMitaa.map((m) => {
            const mtaaChurches = churches.filter((c) => c.mtaa === m.id)
            const churchCount = m.church_count ?? churchCountByMtaa.get(m.id) ?? 0

            return (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {m.name}
                  </CardTitle>
                  {m.jimbo_name && (
                    <p className="text-xs text-muted-foreground">Jimbo: {m.jimbo_name}</p>
                  )}
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Kiongozi:</span> {m.leader_name || "—"}</p>
                    <p><span className="text-muted-foreground">Simu:</span> {m.phone || "—"}</p>
                    <p><span className="text-muted-foreground">Eneo:</span> {m.location || "—"}</p>
                    <p>
                      <span className="text-muted-foreground">Makanisa:</span>{" "}
                      <span className="font-medium">{churchCount}</span>
                    </p>
                  </div>

                  {mtaaChurches.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Makanisa ya mtaa hii:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mtaaChurches.map((church) => (
                          <span
                            key={church.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted text-navy"
                          >
                            <Church className="w-3 h-3" />
                            {church.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Hakuna Mitaa bado. Ongeza kupitia Django Admin au bonyeza "Ongeza Mtaa".</p>
          </CardContent>
        </Card>
      )}

      {mitaa.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Muhtasari wa Mitaa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mitaa.map((item) => (
                <MtaaBadge key={item.id} name={item.name} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
