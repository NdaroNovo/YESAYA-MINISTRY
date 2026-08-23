import type { Church, Mtaa } from "@/types/organization"

interface OrganizationFiltersProps {
  mitaa: Mtaa[]
  churches: Church[]
  selectedMtaa: number | ""
  selectedChurch: number | ""
  onMtaaChange: (value: number | "") => void
  onChurchChange: (value: number | "") => void
  filteredChurches?: Church[]
}

export default function OrganizationFilters({
  mitaa,
  churches,
  selectedMtaa,
  selectedChurch,
  onMtaaChange,
  onChurchChange,
  filteredChurches,
}: OrganizationFiltersProps) {
  const churchOptions = filteredChurches ?? churches

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Chuja kwa Mtaa
        </label>
        <select
          value={selectedMtaa}
          onChange={(e) => {
            const value = e.target.value
            onMtaaChange(value ? Number(value) : "")
            onChurchChange("")
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Mitaa yote ({mitaa.length})</option>
          {mitaa.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.jimbo_name ? ` — ${item.jimbo_name}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Chuja kwa Kanisa
        </label>
        <select
          value={selectedChurch}
          onChange={(e) => {
            const value = e.target.value
            onChurchChange(value ? Number(value) : "")
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Makanisa yote ({churchOptions.length})</option>
          {churchOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.mtaa_name ? ` — ${item.mtaa_name}` : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
