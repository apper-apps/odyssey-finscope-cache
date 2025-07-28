import { useState, useEffect } from "react"
import MetricCard from "@/components/molecules/MetricCard"
import ChartContainer from "@/components/organisms/ChartContainer"
import DataTable from "@/components/organisms/DataTable"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import financialDataService from "@/services/api/financialDataService"
import reportsService from "@/services/api/reportsService"
import metricsService from "@/services/api/metricsService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    setLoading(true)
    setError("")
    try {
      const [financialData, reports] = await Promise.all([
        financialDataService.getAll(),
        reportsService.getAll()
      ])

      setDashboardData(financialData)
      setRecentReports(reports.slice(0, 5))

      // Load metrics for the latest financial data
      if (financialData.length > 0) {
        try {
          const latestData = financialData[0]
          const calculatedMetrics = await metricsService.calculateMetrics(latestData)
          setMetrics(calculatedMetrics)
        } catch (metricsError) {
          console.warn("Could not load metrics:", metricsError.message)
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleCreateNewAnalysis = () => {
navigate("/data-input")
    toast.info("Start your journey to financial goals by inputting your data")
  }

  const handleViewReport = (reportId) => {
    navigate(`/reports?report=${reportId}`)
  }

  if (loading) {
    return <Loading showHeader={true} />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

if (dashboardData.length === 0) {
    return (
      <Empty
        title="Welcome to Personal Finance Analyzer"
        description="Start your journey to financial freedom by inputting your personal financial data to track progress toward your goals like buying a house, saving for retirement, or debt elimination."
        icon="TrendingUp"
        actionLabel="Add My Financial Data"
        onAction={handleCreateNewAnalysis}
      />
    )
  }

  // Calculate summary metrics from available data
  const totalRevenue = dashboardData.reduce((sum, item) => sum + item.incomeStatement.revenue, 0)
  const totalNetIncome = dashboardData.reduce((sum, item) => sum + item.incomeStatement.netIncome, 0)
  const avgProfitMargin = dashboardData.length > 0 ? (totalNetIncome / totalRevenue) * 100 : 0
  const totalAssets = dashboardData.reduce((sum, item) => sum + item.balanceSheet.totalAssets, 0)

  // Chart data for revenue trend
  const revenueChartData = [{
    name: "Revenue",
    data: dashboardData.map(item => item.incomeStatement.revenue)
  }]
  
  const revenueCategories = dashboardData.map(item => item.period)

  // Chart data for profit margins
  const marginChartData = [{
    name: "Net Profit Margin",
    data: dashboardData.map(item => 
      (item.incomeStatement.netIncome / item.incomeStatement.revenue) * 100
    )
  }]

  const tableColumns = [
    { key: "companyName", label: "Company", editable: false },
    { key: "period", label: "Period", editable: false },
    { 
      key: "revenue", 
      label: "Revenue", 
      editable: false,
      format: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { 
      key: "netIncome", 
      label: "Net Income", 
      editable: false,
      format: (value) => `$${(value / 1000).toFixed(0)}K`
    },
    { 
      key: "profitMargin", 
      label: "Profit Margin", 
      editable: false,
      format: (value) => `${value.toFixed(1)}%`
    }
  ]

  const tableData = dashboardData.map(item => ({
    Id: item.Id,
    companyName: item.companyName,
    period: item.period,
    revenue: item.incomeStatement.revenue,
    netIncome: item.incomeStatement.netIncome,
    profitMargin: (item.incomeStatement.netIncome / item.incomeStatement.revenue) * 100
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
<h1 className="text-3xl font-bold gradient-text">My Financial Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your personal financial progress and key metrics toward achieving your goals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            <ApperIcon name="FileBarChart" className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button onClick={handleCreateNewAnalysis}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
          change="+12.5%"
          changeType="positive"
          icon="DollarSign"
          subtitle="Across all periods"
          trend={dashboardData.map(item => item.incomeStatement.revenue)}
        />
        
        <MetricCard
          title="Net Income"
          value={`$${(totalNetIncome / 1000).toFixed(0)}K`}
          change="+8.3%"
          changeType="positive"
          icon="TrendingUp"
          subtitle="Total net profit"
          trend={dashboardData.map(item => item.incomeStatement.netIncome)}
        />
        
        <MetricCard
          title="Avg Profit Margin"
          value={`${avgProfitMargin.toFixed(1)}%`}
          change="-1.2%"
          changeType="negative"
          icon="Percent"
          subtitle="Overall efficiency"
        />
        
        <MetricCard
          title="Total Assets"
          value={`$${(totalAssets / 1000000).toFixed(1)}M`}
          change="+5.7%"
          changeType="positive"
          icon="Building"
          subtitle="Asset portfolio"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Revenue Trend"
          type="line"
          data={revenueChartData}
          categories={revenueCategories}
          height={300}
        />
        
        <ChartContainer
          title="Profit Margin Analysis"
          type="bar"
          data={marginChartData}
          categories={revenueCategories}
          height={300}
        />
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Financial Data */}
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Financial Data"
            data={tableData}
            columns={tableColumns}
            editable={false}
          />
        </div>

        {/* Recent Reports & Key Ratios */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Reports</span>
                <Button size="sm" variant="outline" onClick={() => navigate("/reports")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <div
                      key={report.Id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleViewReport(report.Id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {report.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <ApperIcon name="FileText" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No reports generated yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Financial Ratios */}
          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Key Financial Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Ratio</span>
                    <Badge variant={metrics.liquidityRatios.currentRatio >= 2 ? "success" : "warning"}>
                      {metrics.liquidityRatios.currentRatio.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROE</span>
                    <Badge variant={metrics.profitabilityRatios.returnOnEquity >= 10 ? "success" : "warning"}>
                      {metrics.profitabilityRatios.returnOnEquity.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Debt to Equity</span>
                    <Badge variant={metrics.leverageRatios.debtToEquity <= 1 ? "success" : "warning"}>
                      {metrics.leverageRatios.debtToEquity.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asset Turnover</span>
                    <Badge variant="info">
                      {metrics.efficiencyRatios.assetTurnover.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard