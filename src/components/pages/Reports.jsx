import { useState, useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import reportsService from "@/services/api/reportsService"
import financialDataService from "@/services/api/financialDataService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Reports = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [reports, setReports] = useState([])
  const [financialData, setFinancialData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [generating, setGenerating] = useState(false)

  // Report builder state
  const [reportBuilder, setReportBuilder] = useState({
    financialDataId: "",
    title: "",
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: "",
        order: 1,
        included: true
      },
      {
        id: "liquidity-analysis",
        title: "Liquidity Analysis", 
        content: "",
        order: 2,
        included: true
      },
      {
        id: "profitability-analysis",
        title: "Profitability Analysis",
        content: "",
        order: 3,
        included: true
      },
      {
        id: "leverage-analysis",
        title: "Leverage Analysis",
        content: "",
        order: 4,
        included: false
      },
      {
        id: "efficiency-analysis",
        title: "Efficiency Analysis",
        content: "",
        order: 5,
        included: false
      }
    ],
    charts: [
      {
        id: "revenue-trend",
        type: "line",
        title: "Revenue Trend",
        included: true
      },
      {
        id: "profit-margins",
        type: "bar",
        title: "Profit Margins",
        included: true
      },
      {
        id: "balance-sheet",
        type: "pie",
        title: "Balance Sheet Structure",
        included: false
      }
    ]
  })

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const [reportsData, financialDataList] = await Promise.all([
        reportsService.getAll(),
        financialDataService.getAll()
      ])
      
      setReports(reportsData)
      setFinancialData(financialDataList)

      // Check if generating a report for specific financial data
      if (location.state?.generateFor) {
        const targetData = financialDataList.find(item => item.Id === location.state.generateFor)
        if (targetData) {
          setReportBuilder(prev => ({
            ...prev,
            financialDataId: targetData.Id.toString(),
            title: `Financial Analysis Report - ${targetData.companyName} (${targetData.period})`
          }))
          setShowReportBuilder(true)
        }
      }

      // Check if viewing a specific report
      const reportId = searchParams.get("report")
      if (reportId) {
        const report = reportsData.find(r => r.Id === parseInt(reportId))
        if (report) {
          setSelectedReport(report)
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNewReport = () => {
    setShowReportBuilder(true)
    setSelectedReport(null)
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowReportBuilder(false)
  }

  const handleGenerateReport = async () => {
    if (!reportBuilder.financialDataId || !reportBuilder.title.trim()) {
      toast.error("Please select financial data and enter a report title")
      return
    }

    setGenerating(true)
    try {
      const includedSections = reportBuilder.sections.filter(s => s.included)
      const includedCharts = reportBuilder.charts.filter(c => c.included)
      
      const reportTemplate = {
        title: reportBuilder.title,
        sections: includedSections,
        charts: includedCharts
      }

      const newReport = await reportsService.generateReport(
        reportBuilder.financialDataId,
        reportTemplate
      )

      setReports(prev => [newReport, ...prev])
      setSelectedReport(newReport)
      setShowReportBuilder(false)
      toast.success("Report generated successfully!")
    } catch (err) {
      toast.error("Failed to generate report")
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return
    }

    try {
      await reportsService.delete(reportId)
      setReports(prev => prev.filter(r => r.Id !== reportId))
      if (selectedReport && selectedReport.Id === reportId) {
        setSelectedReport(null)
      }
      toast.success("Report deleted successfully")
    } catch (err) {
      toast.error("Failed to delete report")
    }
  }

  const handleExportReport = (report) => {
    // Simulate PDF export
    toast.success(`Exporting "${report.title}" as PDF...`)
    setTimeout(() => {
      toast.info("PDF export completed successfully!")
    }, 2000)
  }

  const updateReportBuilder = (field, value) => {
    setReportBuilder(prev => ({ ...prev, [field]: value }))
  }

  const updateSection = (sectionId, field, value) => {
    setReportBuilder(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }))
  }

  const updateChart = (chartId, field, value) => {
    setReportBuilder(prev => ({
      ...prev,
      charts: prev.charts.map(chart =>
        chart.id === chartId ? { ...chart, [field]: value } : chart
      )
    }))
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <Loading showHeader={true} />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Report Builder View
  if (showReportBuilder) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Report Builder</h1>
            <p className="text-gray-600 mt-2">
              Create a customized financial analysis report
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowReportBuilder(false)}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Financial Data Source"
                required
              >
                <Select
                  value={reportBuilder.financialDataId}
                  onChange={(e) => updateReportBuilder("financialDataId", e.target.value)}
                >
                  <option value="">Select financial data</option>
                  {financialData.map((item) => (
                    <option key={item.Id} value={item.Id}>
                      {item.companyName} - {item.period}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Report Title"
                value={reportBuilder.title}
                onChange={(e) => updateReportBuilder("title", e.target.value)}
                placeholder="Enter report title"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportBuilder.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={section.included}
                      onChange={(e) => updateSection(section.id, "included", e.target.checked)}
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                  </div>
                  {section.included && (
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, "content", e.target.value)}
                      placeholder={`Enter content for ${section.title}...`}
                      rows="3"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charts & Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportBuilder.charts.map((chart) => (
                <div key={chart.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={chart.included}
                      onChange={(e) => updateChart(chart.id, "included", e.target.checked)}
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{chart.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{chart.type} chart</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowReportBuilder(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={generating}>
            {generating && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
            {generating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>
    )
  }

  // Report Viewer
  if (selectedReport) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{selectedReport.title}</h1>
            <p className="text-gray-600 mt-2">
              Generated on {new Date(selectedReport.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            <Button onClick={() => handleExportReport(selectedReport)}>
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {selectedReport.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {section.content || "This section contains automated analysis based on the financial data provided."}
                </p>
              </CardContent>
            </Card>
          ))}

          {selectedReport.charts && selectedReport.charts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Charts & Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedReport.charts.map((chart) => (
                    <div key={chart.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{chart.title}</h4>
                      <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <ApperIcon name="BarChart3" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 capitalize">{chart.type} Chart</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Reports List View
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Financial Reports</h1>
          <p className="text-gray-600 mt-2">
            Manage and generate comprehensive financial analysis reports
          </p>
        </div>
        <Button onClick={handleCreateNewReport}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <SearchBar
          placeholder="Search reports..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-md"
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {filteredReports.length} reports found
          </span>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        searchTerm ? (
          <Empty
            title="No reports found"
            description={`No reports match your search for "${searchTerm}". Try adjusting your search terms.`}
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <Empty
            title="No Reports Generated Yet"
            description="Create your first financial analysis report to get started with comprehensive insights."
            icon="FileBarChart"
            actionLabel="Create First Report"
            onAction={handleCreateNewReport}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.Id} className="card-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Generated {new Date(report.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="info">PDF</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{report.sections?.length || 0} sections</span>
                  <span>{report.charts?.length || 0} charts</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewReport(report)}
                  >
                    <ApperIcon name="Eye" className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportReport(report)}
                  >
                    <ApperIcon name="Download" className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteReport(report.Id)}
                    className="text-error hover:text-error hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports