import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle } from "lucide-react"
import api from "@/api/axios"
import OrganizationBadge from "@/components/OrganizationBadge"
import { useOrganizationLookup } from "@/hooks/useOrganizationLookup"

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  jimbo_admin: "Jimbo Admin",
  mtaa_leader: "Mtaa Leader",
  church_leader: "Church Leader",
  viewer: "Viewer",
}

interface ProfileUser {
  full_name?: string
  assigned_mtaa?: number | null
  assigned_mtaa_name?: string | null
  assigned_church?: number | null
  assigned_church_name?: string | null
}

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { getMtaaName, getChurchName } = useOrganizationLookup()
  const [profile, setProfile] = useState<ProfileUser | null>(null)

  useEffect(() => {
    api.get("/users/me/")
      .then((res) => setProfile(res.data))
      .catch(() => {})
  }, [])

  const mtaaName = profile?.assigned_mtaa_name ?? getMtaaName(user?.assignedMtaa)
  const churchName = profile?.assigned_church_name ?? getChurchName(user?.assignedChurch)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Profile</h1>
        <p className="text-sm text-muted-foreground">Taarifa za akaunti yako</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCircle className="w-5 h-5 text-gold" />
            Taarifa za Mtumiaji
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Jina kamili</p>
            <p className="font-medium text-navy">{profile?.full_name || user?.fullName || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium text-navy">{user?.username || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-navy">{user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jukumu</p>
            <p className="font-medium text-navy">{user?.role ? ROLE_LABELS[user.role] || user.role : "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Mtaa / Kanisa linalosimamiwa</p>
            <OrganizationBadge mtaaName={mtaaName} churchName={churchName} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
