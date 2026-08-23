import { MapPin, Church } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganizationBadgeProps {
  mtaaName?: string | null
  churchName?: string | null
  className?: string
}

export function MtaaBadge({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700",
        className
      )}
    >
      <MapPin className="w-3 h-3" />
      {name}
    </span>
  )
}

export function ChurchBadge({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gold-100 text-gold-700",
        className
      )}
    >
      <Church className="w-3 h-3" />
      {name}
    </span>
  )
}

export default function OrganizationBadge({
  mtaaName,
  churchName,
  className,
}: OrganizationBadgeProps) {
  if (!mtaaName && !churchName) return <span className="text-muted-foreground">—</span>

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {mtaaName && <MtaaBadge name={mtaaName} />}
      {churchName && <ChurchBadge name={churchName} />}
    </div>
  )
}
