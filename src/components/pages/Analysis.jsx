import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import MetricCard from "@/components/molecules/MetricCard"
import ChartContainer from "@/components/organisms/ChartContainer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import financialDataService from "@/services/api/financialDataService"
import metricsService from "@/services/api/metricsService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Analysis = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [financialData, setFinancialData] = useState([])
  const [selectedDataId, setSelectedDataId] = useState("")
  const [currentData, setCurrentData] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [calculatingMetrics, setCalculatingMetrics] = useState(false)

  const loadFinancialData = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await financialDataService.getAll()
      setFinancialData(data)
      
      // Auto-select the first item or the latest one if coming from data input
      if (data.length > 0) {
        const defaultSelection = location.state?.newData ? data[data.length - 1] : data[0]
        setSelectedDataId(defaultSelection.Id.toString())
        setCurrentData(defaultSelection)
        await loadMetrics(defaultSelection)
      }
    } catch (err) {
      setError(err.message || "Failed to load financial data")
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async (data) => {
    setCalculatingMetrics(true)
    try {
      const calculatedMetrics = await metricsService.calculateMetrics(data)
      setMetrics(calculatedMetrics)
    } catch (err) {
      console.error("Failed to calculate metrics:", err)
      toast.error("Failed to calculate financial metrics")
    } finally {
      setCalculatingMetrics(false)
    }
  }

  const handleDataSelection = async (dataId) => {
    setSelectedDataId(dataId)
    const selectedData = financialData.find(item => item.Id === parseInt(dataId))
    if (selectedData) {
      setCurrentData(selectedData)
      await loadMetrics(selectedData)
    }
  }

  const handleGenerateReport = () => {
    if (currentData) {
      navigate("/reports", { state: { generateFor: currentData.Id } })
      toast.info("Generating comprehensive report...")
    }
  }

  useEffect(() => {
    loadFinancialData()
  }, [])

  if (loading) {
    return <Loading showHeader={true} />
  }

  if (error) {
    return <Error message={error} onRetry={loadFinancialData} />
  }

  if (financialData.length === 0) {
    return (
      <Empty
        title="No Financial Data Available"
        description="Add financial data first to see comprehensive analysis and insights."
        icon="BarChart3"
        actionLabel="Add Financial Data"
        onAction={() => navigate("/data-input")}
      />
    )
  }

  if (!currentData || !metrics) {
    return <Loading />
  }

  // Prepare chart data
  const revenueBreakdownData = [{
    name: "Revenue Components",
    data: [
      currentData.incomeStatement.revenue - currentData.incomeStatement.costOfGoodsSold,
      currentData.incomeStatement.costOfGoodsSold
    ]
  }]

  const revenueBreakdownCategories = ["Gross Profit", "Cost of Goods Sold"]

  const profitabilityData = [{
    name: "Profit Margins",
    data: [
      metrics.profitabilityRatios.grossProfitMargin,
      metrics.profitabilityRatios.operatingMargin,
      metrics.profitabilityRatios.netProfitMargin
    ]
  }]

  const profitabilityCategories = ["Gross Margin", "Operating Margin", "Net Margin"]

  const liquidityData = [{
    name: "Liquidity Ratios",
    data: [
      metrics.liquidityRatios.currentRatio,
      metrics.liquidityRatios.quickRatio,
      metrics.liquidityRatios.cashRatio
    ]
  }]

  const liquidityCategories = ["Current Ratio", "Quick Ratio", "Cash Ratio"]

  const balanceSheetData = [{
    name: "Assets vs Liabilities",
    data: [currentData.balanceSheet.totalAssets, currentData.balanceSheet.totalLiabilities, currentData.balanceSheet.shareholderEquity]
  }]

  const balanceSheetCategories = ["Total Assets", "Total Liabilities", "Shareholder Equity"]

  const getRatingBadge = (value, thresholds) => {
    if (value >= thresholds.excellent) return <Badge variant="success">Excellent</Badge>
    if (value >= thresholds.good) return <Badge variant="info">Good</Badge>
    if (value >= thresholds.fair) return <Badge variant="warning">Fair</Badge>
    return <Badge variant="error">Poor</Badge>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Financial Analysis</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of financial performance and key metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedDataId}
            onChange={(e) => handleDataSelection(e.target.value)}
            className="min-w-[250px]"
          >
            {financialData.map((item) => (
              <option key={item.Id} value={item.Id}>
                {item.companyName} - {item.period}
              </option>
            ))}
          </Select>
          <Button onClick={handleGenerateReport}>
            <ApperIcon name="FileBarChart" className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Company Info Card */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentData.companyName}</h2>
              <p className="text-gray-600">Reporting Period: {currentData.period}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Analysis Generated</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value={`$${(currentData.incomeStatement.revenue / 1000000).toFixed(1)}M`}
          icon="DollarSign"
          subtitle="Total revenue"
        />
        
        <MetricCard
          title="Net Profit Margin"
          value={`${metrics.profitabilityRatios.netProfitMargin.toFixed(1)}%`}
          change={metrics.profitabilityRatios.netProfitMargin >= 10 ? "+2.1%" : "-1.3%"}
          changeType={metrics.profitabilityRatios.netProfitMargin >= 10 ? "positive" : "negative"}
          icon="Percent"
          subtitle="Profitability efficiency"
        />
        
        <MetricCard
          title="Current Ratio"
          value={metrics.liquidityRatios.currentRatio.toFixed(2)}
          change={metrics.liquidityRatios.currentRatio >= 2 ? "+0.15" : "-0.08"}
          changeType={metrics.liquidityRatios.currentRatio >= 2 ? "positive" : "negative"}
          icon="Droplets"
          subtitle="Liquidity position"
        />
        
        <MetricCard
          title="Return on Equity"
          value={`${metrics.profitabilityRatios.returnOnEquity.toFixed(1)}%`}
          change={metrics.profitabilityRatios.returnOnEquity >= 15 ? "+1.8%" : "-0.9%"}
          changeType={metrics.profitabilityRatios.returnOnEquity >= 15 ? "positive" : "negative"}
          icon="TrendingUp"
          subtitle="Shareholder returns"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Revenue Breakdown"
          type="pie"
          data={revenueBreakdownData}
          categories={revenueBreakdownCategories}
          height={300}
        />
        
        <ChartContainer
          title="Profitability Analysis"
          type="bar"
          data={profitabilityData}
          categories={profitabilityCategories}
          height={300}
        />
        
        <ChartContainer
          title="Liquidity Ratios"
          type="radar"
          data={liquidityData}
          categories={liquidityCategories}
          height={300}
        />
        
        <ChartContainer
          title="Balance Sheet Structure"
          type="bar"
          data={balanceSheetData}
          categories={balanceSheetCategories}
          height={300}
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Droplets" className="h-5 w-5" />
              Liquidity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Ratio</p>
                  <p className="text-sm text-gray-500">Current Assets / Current Liabilities</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.liquidityRatios.currentRatio.toFixed(2)}</p>
                  {getRatingBadge(metrics.liquidityRatios.currentRatio, { excellent: 2.5, good: 2.0, fair: 1.5 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Quick Ratio</p>
                  <p className="text-sm text-gray-500">Quick Assets / Current Liabilities</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.liquidityRatios.quickRatio.toFixed(2)}</p>
                  {getRatingBadge(metrics.liquidityRatios.quickRatio, { excellent: 1.5, good: 1.2, fair: 1.0 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Cash Ratio</p>
                  <p className="text-sm text-gray-500">Cash / Current Liabilities</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.liquidityRatios.cashRatio.toFixed(2)}</p>
                  {getRatingBadge(metrics.liquidityRatios.cashRatio, { excellent: 0.5, good: 0.3, fair: 0.2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profitability Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" className="h-5 w-5" />
              Profitability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Gross Profit Margin</p>
                  <p className="text-sm text-gray-500">Gross Profit / Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.profitabilityRatios.grossProfitMargin.toFixed(1)}%</p>
                  {getRatingBadge(metrics.profitabilityRatios.grossProfitMargin, { excellent: 50, good: 30, fair: 20 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Operating Margin</p>
                  <p className="text-sm text-gray-500">Operating Income / Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.profitabilityRatios.operatingMargin.toFixed(1)}%</p>
                  {getRatingBadge(metrics.profitabilityRatios.operatingMargin, { excellent: 20, good: 15, fair: 10 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Return on Assets</p>
                  <p className="text-sm text-gray-500">Net Income / Total Assets</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.profitabilityRatios.returnOnAssets.toFixed(1)}%</p>
                  {getRatingBadge(metrics.profitabilityRatios.returnOnAssets, { excellent: 10, good: 5, fair: 2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Zap" className="h-5 w-5" />
              Efficiency Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Asset Turnover</p>
                  <p className="text-sm text-gray-500">Revenue / Total Assets</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.efficiencyRatios.assetTurnover.toFixed(2)}</p>
                  {getRatingBadge(metrics.efficiencyRatios.assetTurnover, { excellent: 2.0, good: 1.0, fair: 0.5 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Inventory Turnover</p>
                  <p className="text-sm text-gray-500">COGS / Average Inventory</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.efficiencyRatios.inventoryTurnover.toFixed(1)}</p>
                  {getRatingBadge(metrics.efficiencyRatios.inventoryTurnover, { excellent: 8, good: 6, fair: 4 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Receivables Turnover</p>
                  <p className="text-sm text-gray-500">Revenue / Avg Receivables</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.efficiencyRatios.receivablesTurnover.toFixed(1)}</p>
                  {getRatingBadge(metrics.efficiencyRatios.receivablesTurnover, { excellent: 12, good: 8, fair: 6 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leverage Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Scale" className="h-5 w-5" />
              Leverage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Debt to Equity</p>
                  <p className="text-sm text-gray-500">Total Debt / Shareholder Equity</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.leverageRatios.debtToEquity.toFixed(2)}</p>
                  {getRatingBadge(1 / (metrics.leverageRatios.debtToEquity + 1), { excellent: 0.7, good: 0.5, fair: 0.4 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Debt to Assets</p>
                  <p className="text-sm text-gray-500">Total Debt / Total Assets</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.leverageRatios.debtToAssets.toFixed(2)}</p>
                  {getRatingBadge(1 - metrics.leverageRatios.debtToAssets, { excellent: 0.7, good: 0.6, fair: 0.5 })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Interest Coverage</p>
                  <p className="text-sm text-gray-500">Operating Income / Interest Expense</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metrics.leverageRatios.interestCoverage.toFixed(1)}x</p>
                  {getRatingBadge(metrics.leverageRatios.interestCoverage, { excellent: 10, good: 5, fair: 2.5 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pb-8">
        <Button variant="outline" onClick={() => navigate("/data-input")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add More Data
        </Button>
        <Button onClick={handleGenerateReport}>
          <ApperIcon name="FileBarChart" className="h-4 w-4 mr-2" />
          Generate Full Report
        </Button>
      </div>
    </div>
  )
}

export default Analysis