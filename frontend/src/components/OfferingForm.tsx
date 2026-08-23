import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { X, Save, Loader2 } from "lucide-react"
import { OfferingFormData, fetchOfferingTypes } from "@/api/services/offerings"
import { Church } from "@/types/organization"

interface OfferingFormProps {
  churches: Church[]
  onSubmit: (data: OfferingFormData) => void
  onCancel: () => void
  initialData?: Partial<OfferingFormData>
}

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Machi" },
  { value: 4, label: "Aprili" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Julai" },
  { value: 8, label: "Agosti" },
  { value: 9, label: "Septemba" },
  { value: 10, label: "Oktoba" },
  { value: 11, label: "Novemba" },
  { value: 12, label: "Desemba" },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export default function OfferingForm({ churches, onSubmit, onCancel, initialData }: OfferingFormProps) {
  const [offeringTypes, setOfferingTypes] = useState<any[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [formData, setFormData] = useState<OfferingFormData>({
    church: initialData?.church || 0,
    offering_type: initialData?.offering_type || 0,
    amount: initialData?.amount || 0,
    month: initialData?.month || new Date().getMonth() + 1,
    year: initialData?.year || currentYear,
    notes: initialData?.notes || "",
  })

  useEffect(() => {
    fetchOfferingTypes()
      .then(setOfferingTypes)
      .catch(() => {})
      .finally(() => setLoadingTypes(false))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-2 border-gold">
      <CardHeader className="bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ingiza Matoleo</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kanisa *</label>
              <Select
                value={formData.church || ""}
                onChange={(e) => setFormData({ ...formData, church: Number(e.target.value) })}
                required
              >
                <option value="">Chagua Kanisa</option>
                {churches.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Aina ya Matoleo *</label>
              {loadingTypes ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inapakia...
                </div>
              ) : (
                <Select
                  value={formData.offering_type || ""}
                  onChange={(e) => setFormData({ ...formData, offering_type: Number(e.target.value) })}
                  required
                >
                  <option value="">Chagua Aina</option>
                  {offeringTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kiasi (TSh) *</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mwezi *</label>
              <Select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                required
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mwaka *</label>
              <Select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                required
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Maoni</label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Andika maoni yako..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" /> Ghairi
            </Button>
            <Button type="submit" variant="gold">
              <Save className="w-4 h-4 mr-2" } Hifadhi
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
