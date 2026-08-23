import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Banknote, Plus, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { fetchOfferings, createOffering, type Offering, type OfferingFormData } from "@/api/services/offerings"
import OrganizationFilters from "@/components/OrganizationFilters"
import OfferingForm from "@/components/OfferingForm"
import { useOrganizationLookup } from "@/hooks/useOrganizationLookup"

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function OfferingsPage() {
  const { mitaa, churches, getChurchesForMtaa, getMtaaName, getChurchName, loading: lookupLoading } =
    useOrganizationLookup()
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showData, setShowData] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMtaa, setSelectedMtaa] = useState<number | "">("")
  const [selectedChurch, setSelectedChurch] = useState<number | "">("")

  useEffect(() => {
    loadOfferings()
  }, [selectedMtaa, selectedChurch])

  const loadOfferings = async () => {
    const filters: Record<string, number | string> = {}
    if (selectedMtaa) filters.mtaa = selectedMtaa
    if (selectedChurch) filters.church = selectedChurch
    if (searchTerm) filters.search = searchTerm

    setLoading(true)
    try {
      const data = await fetchOfferings(filters)
      setOfferings(data)
    } catch {
      setOfferings([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filters: Record<string, number | string> = {}
    if (selectedMtaa) filters.mtaa = selectedMtaa
    if (selectedChurch) filters.church = selectedChurch
    if (value) filters.search = value

    setLoading(true)
    fetchOfferings(filters)
      .then(setOfferings)
      .catch(() => setOfferings([]))
      .finally(() => setLoading(false))
  }

  const handleFormSubmit = async (data: OfferingFormData) => {
    try {
      await createOffering(data)
      setShowForm(false)
      loadOfferings()
    } catch (error) {
      console.error("Error creating offering:", error)
    }
  }

  if (lookupLoading) return <p className="text-muted-foreground">Inapakia...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Offerings</h1>
          <p className="text-sm text-muted-foreground">
            Usimamizi wa Matoleo — {offerings.length} rekodi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowData(!showData)}>
            {showData ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            {showData ? "Ficha" : "Onesha"} Taarifa
          </Button>
          <Button variant="gold" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" /> {showForm ? "Ficha" : "Ingiza"} Matoleo
          </Button>
        </div>
      </div>

      {showForm && (
        <OfferingForm
          churches={churches}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tafuta matoleo..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          <OrganizationFilters
            mitaa={mitaa}
            churches={churches}
            selectedMtaa={selectedMtaa}
            selectedChurch={selectedChurch}
            onMtaaChange={setSelectedMtaa}
            onChurchChange={setSelectedChurch}
            filteredChurches={getChurchesForMtaa(selectedMtaa || null)}
          />
        </CardContent>
      </Card>

      {showData && (
        <>
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gold" />
                <p className="text-muted-foreground">Inapakia taarifa...</p>
              </CardContent>
            </Card>
          ) : offerings.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-navy text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Mtaa</th>
                        <th className="px-4 py-3 text-left">Kanisa</th>
                        <th className="px-4 py-3 text-left">Aina</th>
                        <th className="px-4 py-3 text-left">Kipindi</th>
                        <th className="px-4 py-3 text-right">Kiasi (TSh)</th>
                        <th className="px-4 py-3 text-right">Kanisa Share</th>
                        <th className="px-4 py-3 text-right">Jimbo Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerings.map((o) => (
                        <tr key={o.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{o.mtaa_name ?? getMtaaName(o.mtaa_id)}</td>
                          <td className="px-4 py-3 font-medium">{o.church_name ?? getChurchName(o.church)}</td>
                          <td className="px-4 py-3">{o.offering_type_name ?? "—"}</td>
                          <td className="px-4 py-3">{MONTHS[o.month]} {o.year}</td>
                          <td className="px-4 py-3 text-right font-medium">{Number(o.amount).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{Number(o.church_share).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{Number(o.field_share).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Banknote className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Hakuna matoleo kwa vichujio ulivyochagua.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
