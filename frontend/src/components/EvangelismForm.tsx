import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { X, Save } from "lucide-react"
import { EvangelismFormData } from "@/api/services/evangelism"
import { Church } from "@/types/organization"

interface EvangelismFormProps {
  churches: Church[]
  onSubmit: (data: EvangelismFormData) => void
  onCancel: () => void
  initialData?: Partial<EvangelismFormData>
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

export default function EvangelismForm({ churches, onSubmit, onCancel, initialData }: EvangelismFormProps) {
  const [formData, setFormData] = useState<EvangelismFormData>({
    church: initialData?.church || 0,
    month: initialData?.month || new Date().getMonth() + 1,
    year: initialData?.year || currentYear,
    baptized: initialData?.baptized || 0,
    converted: initialData?.converted || 0,
    visited: initialData?.visited || 0,
    supported: initialData?.supported || 0,
    comments: initialData?.comments || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-2 border-gold">
      <CardHeader className="bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ingiza Taarifa za Uinjilisti</CardTitle>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Waliobatizwa</label>
              <Input
                type="number"
                min="0"
                value={formData.baptized}
                onChange={(e) => setFormData({ ...formData, baptized: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Waliokombolewa</label>
              <Input
                type="number"
                min="0"
                value={formData.converted}
                onChange={(e) => setFormData({ ...formData, converted: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Waliotembelewa</label>
              <Input
                type="number"
                min="0"
                value={formData.visited}
                onChange={(e) => setFormData({ ...formData, visited: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Waliosaidiwa</label>
              <Input
                type="number"
                min="0"
                value={formData.supported}
                onChange={(e) => setFormData({ ...formData, supported: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Maoni</label>
            <Input
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
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
