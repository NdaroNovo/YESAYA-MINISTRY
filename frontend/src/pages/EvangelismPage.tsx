import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeartHandshake, Plus, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { fetchEvangelismRecords, createEvangelismRecord, type EvangelismRecord, type EvangelismFormData } from "@/api/services/evangelism"
import OrganizationFilters from "@/components/OrganizationFilters"
import EvangelismForm from "@/components/EvangelismForm"
import { useOrganizationLookup } from "@/hooks/useOrganizationLookup"

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function EvangelismPage() {
  const { mitaa, churches, getChurchesForMtaa, getMtaaName, getChurchName, loading: lookupLoading } =
    useOrganizationLookup()
  const [records, setRecords] = useState<EvangelismRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showData, setShowData] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMtaa, setSelectedMtaa] = useState<number | "">("")
  const [selectedChurch, setSelectedChurch] = useState<number | "">("")

  useEffect(() => {
    loadRecords()
  }, [selectedMtaa, selectedChurch])

  const loadRecords = async () => {
    const filters: Record<string, number | string> = {}
    if (selectedMtaa) filters.mtaa = selectedMtaa
    if (selectedChurch) filters.church = selectedChurch
    if (searchTerm) filters.search = searchTerm

    setLoading(true)
    try {
      const data = await fetchEvangelismRecords(filters)
      setRecords(data)
    } catch {
      setRecords([])
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
    fetchEvangelismRecords(filters)
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }

  const handleFormSubmit = async (data: EvangelismFormData) => {
    try {
      await createEvangelismRecord(data)
      setShowForm(false)
      loadRecords()
    } catch (error) {
      console.error("Error creating record:", error)
    }
  }

  if (lookupLoading) return <p className="text-muted-foreground">Inapakia...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Evangelism</h1>
          <p className="text-sm text-muted-foreground">
            Taarifa za uinjilisti — {records.length} rekodi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowData(!showData)}>
            {showData ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            {showData ? "Ficha" : "Onesha"} Taarifa
          </Button>
          <Button variant="gold" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" /> {showForm ? "Ficha" : "Ingiza"} Taarifa
          </Button>
        </div>
      </div>

      {showForm && (
        <EvangelismForm
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
              placeholder="Tafuta taarifa za uinjilisti..."
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
          ) : records.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-navy text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Mtaa</th>
                        <th className="px-4 py-3 text-left">Kanisa</th>
                        <th className="px-4 py-3 text-left">Kipindi</th>
                        <th className="px-4 py-3 text-right">Waliobatizwa</th>
                        <th className="px-4 py-3 text-right">Waliokombolewa</th>
                        <th className="px-4 py-3 text-right">Waliotembelewa</th>
                        <th className="px-4 py-3 text-right">Waliosaidika</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r) => (
                        <tr key={r.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            {r.mtaa_name ?? getMtaaName(r.mtaa_id)}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {r.church_name ?? getChurchName(r.church)}
                          </td>
                          <td className="px-4 py-3">{MONTHS[r.month]} {r.year}</td>
                          <td className="px-4 py-3 text-right font-medium">{r.baptized}</td>
                          <td className="px-4 py-3 text-right font-medium">{r.converted}</td>
                          <td className="px-4 py-3 text-right font-medium">{r.visited}</td>
                          <td className="px-4 py-3 text-right font-medium">{r.supported}</td>
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
                <HeartHandshake className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Hakuna taarifa za uinjilisti kwa vichujio ulivyochagua.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
