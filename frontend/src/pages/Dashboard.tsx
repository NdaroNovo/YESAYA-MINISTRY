import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Church,
  Users,
  Banknote,
  Droplets,
  HeartHandshake,
  Activity,
  Calendar,
} from "lucide-react"
import api from "@/api/axios"
import { useOrganizationLookup } from "@/hooks/useOrganizationLookup"

interface DashboardStats {
  period: string
  total_mitaa: number
  total_churches: number
  total_members: number
  total_baptized: number
  total_converted: number
  total_offerings: number
  total_visited: number
  total_supported: number
  church_share: number
  field_share: number
}

type TimePeriod = "all" | "week" | "month" | "year"

export default function Dashboard() {
  const { mitaa, churches, loading: lookupLoading } = useOrganizationLookup()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("all")

  useEffect(() => {
    api.get("/dashboard-stats/", { params: { period: selectedPeriod } })
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [selectedPeriod])

  const displayStats = [
    {
      title: "Jumla ya Mitaa",
      value: stats?.total_mitaa ?? mitaa.length,
      icon: MapPin,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Jumla ya Makanisa",
      value: stats?.total_churches ?? churches.length,
      icon: Church,
      color: "bg-gold-100 text-gold-600",
    },
    {
      title: "Wanachama",
      value: (stats?.total_members ?? churches.reduce((sum, c) => sum + c.member_count, 0)).toLocaleString(),
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Matoleo (Jumla)",
      value: stats?.total_offerings
        ? `TSh ${Number(stats.total_offerings).toLocaleString()}`
        : "—",
      icon: Banknote,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Waliobatizwa",
      value: stats?.total_baptized ?? 0,
      icon: Droplets,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Waliokombolewa",
      value: stats?.total_converted ?? 0,
      icon: HeartHandshake,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Waliotembelea",
      value: stats?.total_visited ?? 0,
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Waliosaidiwa",
      value: stats?.total_supported ?? 0,
      icon: HeartHandshake,
      color: "bg-rose-100 text-rose-600",
    },
  ]

  const periodLabels: Record<TimePeriod, string> = {
    all: "Jumla",
    week: "Wiki",
    month: "Mwezi",
    year: "Mwaka",
  }

  const periodButtons: TimePeriod[] = ["all", "week", "month", "year"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Muhtasari wa mfumo wa YESAYA MINISTRY
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {periodButtons.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "gold" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {periodLabels[period]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat) => (
          <Card key={stat.title} className="border border-border hover:shadow-sm transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-navy mt-1">{stat.value}</p>
                  {selectedPeriod !== "all" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      (Kwa {periodLabels[selectedPeriod]})
                    </p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-4 h-4 text-blue-600" />
              Mitaa Yote ({mitaa.length})
            </CardTitle>
            <CardDescription>Orodha kamili ya mitaa katika mfumo</CardDescription>
          </CardHeader>
          <CardContent>
            {lookupLoading ? (
              <p className="text-sm text-muted-foreground">Inapakia...</p>
            ) : mitaa.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {mitaa.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                  >
                    <MapPin className="w-3 h-3" />
                    {item.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Hakuna mitaa bado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Church className="w-4 h-4 text-gold" />
              Makanisa Yote ({churches.length})
            </CardTitle>
            <CardDescription>Orodha kamili ya makanisa na mtaa zao</CardDescription>
          </CardHeader>
          <CardContent>
            {lookupLoading ? (
              <p className="text-sm text-muted-foreground">Inapakia...</p>
            ) : churches.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {churches.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm"
                  >
                    <span className="font-medium text-navy">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.mtaa_name ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Hakuna makanisa bado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-4 h-4 text-gold" />
            Muundo wa Jimbo
          </CardTitle>
          <CardDescription>Mitaa na makanisa yake</CardDescription>
        </CardHeader>
        <CardContent>
          {lookupLoading ? (
            <p className="text-sm text-muted-foreground">Inapakia...</p>
          ) : mitaa.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mitaa.map((mtaaItem) => {
                const mtaaChurches = churches.filter((c) => c.mtaa === mtaaItem.id)
                return (
                  <div key={mtaaItem.id} className="p-4 rounded-lg border">
                    <p className="font-semibold text-navy flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {mtaaItem.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mtaaChurches.length} makanisa
                    </p>
                    {mtaaChurches.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {mtaaChurches.map((church) => (
                          <li key={church.id} className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Church className="w-3 h-3" />
                            {church.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Hakuna data ya muundo bado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
