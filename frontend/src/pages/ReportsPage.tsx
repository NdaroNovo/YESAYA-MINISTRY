import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Church, MapPin, Users, Loader2 } from "lucide-react"
import { generateReport } from "@/api/services/organization"

interface ReportData {
  churches?: any[]
  mitaa?: any[]
  jimbo?: any[]
  offerings?: any[]
  evangelism?: any[]
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true)
    setSelectedReport(reportType)
    try {
      const data = await generateReport(reportType)
      setReportData(data)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!reportData) return
    
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `yesaya-ministry-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports</h1>
          <p className="text-sm text-muted-foreground">Ripoti za mfumo</p>
        </div>
        {reportData && (
          <Button variant="gold" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" } Pakua Ripoti
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleGenerateReport("churches")}
        >
          <CardContent className="p-6">
            <Church className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-navy">Ripoti ya Makanisa</h3>
            <p className="text-sm text-muted-foreground mt-1">Orodha na takwimu za makanisa yote</p>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleGenerateReport("mitaa")}
        >
          <CardContent className="p-6">
            <MapPin className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-navy">Ripoti ya Mitaa</h3>
            <p className="text-sm text-muted-foreground mt-1">Orodha na takwimu za mitaa yote</p>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleGenerateReport("jimbo")}
        >
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-gold mb-3" />
            <h3 className="font-semibold text-navy">Ripoti ya Majimbo</h3>
            <p className="text-sm text-muted-foreground mt-1">Orodha na takwimu za majimbo yote</p>
          </CardContent>
        </Card>
        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleGenerateReport("all")}
        >
          <CardContent className="p-6">
            <FileText className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-navy">Ripoti ya Jumla</h3>
            <p className="text-sm text-muted-foreground mt-1">Muhtasari wa mfumo wote</p>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gold" />
            <p className="text-muted-foreground">Inatengeneza ripoti...</p>
          </CardContent>
        </Card>
      )}

      {reportData && !loading && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-navy">Matokeo ya Ripoti</h2>
          
          {reportData.churches && reportData.churches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="w-5 h-5 text-purple-600" />
                  Makanisa ({reportData.churches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Jina</th>
                        <th className="text-left p-2">Mchungaji</th>
                        <th className="text-left p-2">Mtaa</th>
                        <th className="text-left p-2">Jimbo</th>
                        <th className="text-left p-2">Wanachama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.churches.map((church) => (
                        <tr key={church.id} className="border-b">
                          <td className="p-2">{church.name}</td>
                          <td className="p-2">{church.pastor_name || "—"}</td>
                          <td className="p-2">{church.mtaa}</td>
                          <td className="p-2">{church.jimbo}</td>
                          <td className="p-2">{church.member_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportData.mitaa && reportData.mitaa.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Mitaa ({reportData.mitaa.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Jina</th>
                        <th className="text-left p-2">Kiongozi</th>
                        <th className="text-left p-2">Jimbo</th>
                        <th className="text-left p-2">Makanisa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.mitaa.map((mtaa) => (
                        <tr key={mtaa.id} className="border-b">
                          <td className="p-2">{mtaa.name}</td>
                          <td className="p-2">{mtaa.leader_name || "—"}</td>
                          <td className="p-2">{mtaa.jimbo}</td>
                          <td className="p-2">{mtaa.church_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportData.jimbo && reportData.jimbo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  Majimbo ({reportData.jimbo.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Jina</th>
                        <th className="text-left p-2">Wilaya</th>
                        <th className="text-left p-2">Mkoa</th>
                        <th className="text-left p-2">Mitaa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.jimbo.map((jimbo) => (
                        <tr key={jimbo.id} className="border-b">
                          <td className="p-2">{jimbo.name}</td>
                          <td className="p-2">{jimbo.district || "—"}</td>
                          <td className="p-2">{jimbo.region || "—"}</td>
                          <td className="p-2">{jimbo.mtaa_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
