import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import TabNavigation from "@/components/molecules/TabNavigation"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import financialDataService from "@/services/api/financialDataService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const DataInput = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("income")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    period: "",
    incomeStatement: {
      revenue: "",
      costOfGoodsSold: "",
      grossProfit: "",
      operatingExpenses: "",
      operatingIncome: "",
      interestExpense: "",
      netIncome: ""
    },
    balanceSheet: {
      currentAssets: "",
      totalAssets: "",
      currentLiabilities: "",
      totalLiabilities: "",
      shareholderEquity: ""
    },
    cashFlow: {
      operatingCashFlow: "",
      investingCashFlow: "",
      financingCashFlow: "",
      netCashFlow: ""
    }
  })

  const [validationErrors, setValidationErrors] = useState({})

  const tabs = [
    { id: "income", label: "Income Statement" },
    { id: "balance", label: "Balance Sheet" },
    { id: "cashflow", label: "Cash Flow" }
  ]

  const handleInputChange = (section, field, value) => {
    const numericValue = value === "" ? "" : parseFloat(value) || 0
    
    setFormData(prev => {
      if (section === "general") {
        return { ...prev, [field]: value }
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: numericValue
        }
      }
    })

    // Clear validation error when user starts typing
    if (validationErrors[`${section}.${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`${section}.${field}`]
        return newErrors
      })
    }

    // Auto-calculate derived values
    calculateDerivedValues(section, field, numericValue)
  }

  const calculateDerivedValues = (section, field, value) => {
    if (section === "incomeStatement") {
      const income = { ...formData.incomeStatement }
      
      if (field === "revenue" || field === "costOfGoodsSold") {
        const revenue = field === "revenue" ? value : income.revenue
        const cogs = field === "costOfGoodsSold" ? value : income.costOfGoodsSold
        if (revenue && cogs) {
          income.grossProfit = revenue - cogs
        }
      }
      
      if (field === "grossProfit" || field === "operatingExpenses") {
        const grossProfit = field === "grossProfit" ? value : income.grossProfit
        const opExpenses = field === "operatingExpenses" ? value : income.operatingExpenses
        if (grossProfit && opExpenses) {
          income.operatingIncome = grossProfit - opExpenses
        }
      }
      
      if (field === "operatingIncome" || field === "interestExpense") {
        const opIncome = field === "operatingIncome" ? value : income.operatingIncome
        const interest = field === "interestExpense" ? value : income.interestExpense
        if (opIncome && interest) {
          income.netIncome = (opIncome - interest) * 0.75 // Assuming 25% tax rate
        }
      }

      setFormData(prev => ({ ...prev, incomeStatement: income }))
    }

    if (section === "balanceSheet") {
      const balance = { ...formData.balanceSheet }
      
      if (field === "totalAssets" || field === "totalLiabilities") {
        const assets = field === "totalAssets" ? value : balance.totalAssets
        const liabilities = field === "totalLiabilities" ? value : balance.totalLiabilities
        if (assets && liabilities) {
          balance.shareholderEquity = assets - liabilities
        }
      }

      setFormData(prev => ({ ...prev, balanceSheet: balance }))
    }

    if (section === "cashFlow") {
      const cashFlow = { ...formData.cashFlow }
      const { operatingCashFlow, investingCashFlow, financingCashFlow } = cashFlow
      
      if (field === "operatingCashFlow" || field === "investingCashFlow" || field === "financingCashFlow") {
        const operating = field === "operatingCashFlow" ? value : operatingCashFlow
        const investing = field === "investingCashFlow" ? value : investingCashFlow
        const financing = field === "financingCashFlow" ? value : financingCashFlow
        
        if (operating !== "" && investing !== "" && financing !== "") {
          cashFlow.netCashFlow = operating + investing + financing
        }
      }

      setFormData(prev => ({ ...prev, cashFlow }))
    }
  }

  const validateForm = () => {
    const errors = {}

    // Validate general information
// Company name is optional for individual users
    // No validation required for personal finance tracking
    if (!formData.period.trim()) {
      errors["general.period"] = "Period is required"
    }

    // Validate income statement
    const requiredIncomeFields = ["revenue", "costOfGoodsSold", "operatingExpenses", "interestExpense"]
    requiredIncomeFields.forEach(field => {
      if (!formData.incomeStatement[field] || formData.incomeStatement[field] <= 0) {
        errors[`incomeStatement.${field}`] = "This field is required and must be greater than 0"
      }
    })

    // Validate balance sheet
    const requiredBalanceFields = ["currentAssets", "totalAssets", "currentLiabilities", "totalLiabilities"]
    requiredBalanceFields.forEach(field => {
      if (!formData.balanceSheet[field] || formData.balanceSheet[field] <= 0) {
        errors[`balanceSheet.${field}`] = "This field is required and must be greater than 0"
      }
    })

    // Validate cash flow
    const requiredCashFlowFields = ["operatingCashFlow"]
    requiredCashFlowFields.forEach(field => {
      if (formData.cashFlow[field] === "" || formData.cashFlow[field] === null) {
        errors[`cashFlow.${field}`] = "Operating cash flow is required"
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving")
      return
    }

    setSaving(true)
    setError("")

    try {
      const dataToSave = {
        ...formData,
        // Convert string values to numbers
        incomeStatement: Object.keys(formData.incomeStatement).reduce((acc, key) => {
          acc[key] = parseFloat(formData.incomeStatement[key]) || 0
          return acc
        }, {}),
        balanceSheet: Object.keys(formData.balanceSheet).reduce((acc, key) => {
          acc[key] = parseFloat(formData.balanceSheet[key]) || 0
          return acc
        }, {}),
        cashFlow: Object.keys(formData.cashFlow).reduce((acc, key) => {
          acc[key] = parseFloat(formData.cashFlow[key]) || 0
          return acc
        }, {})
      }

      await financialDataService.create(dataToSave)
      toast.success("Financial data saved successfully!")
      navigate("/analysis", { state: { newData: true } })
    } catch (err) {
      setError(err.message || "Failed to save financial data")
      toast.error("Failed to save financial data")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setFormData({
      companyName: "",
      period: "",
      incomeStatement: {
        revenue: "",
        costOfGoodsSold: "",
        grossProfit: "",
        operatingExpenses: "",
        operatingIncome: "",
        interestExpense: "",
        netIncome: ""
      },
      balanceSheet: {
        currentAssets: "",
        totalAssets: "",
        currentLiabilities: "",
        totalLiabilities: "",
        shareholderEquity: ""
      },
      cashFlow: {
        operatingCashFlow: "",
        investingCashFlow: "",
        financingCashFlow: "",
        netCashFlow: ""
      }
    })
    setValidationErrors({})
    toast.info("Form has been reset")
  }

  if (loading) {
    return <Loading />
  }

  if (error && !saving) {
    return <Error message={error} onRetry={() => setError("")} />
  }

  const formatCurrency = (value) => {
    if (value === "" || value === 0) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
<h1 className="text-3xl font-bold gradient-text">My Financial Data Input</h1>
          <p className="text-gray-600 mt-2">
            Enter your personal financial information to track progress toward your goals like buying a house, saving for retirement, or building wealth
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Building" className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
              label="Profile Name (Optional)"
              value={formData.companyName}
              onChange={(e) => handleInputChange("general", "companyName", e.target.value)}
              error={validationErrors["general.companyName"]}
              placeholder="Enter a name for this financial profile (e.g., 'My 2024 Finances')"
            />
            <FormField
              label="Reporting Period"
              error={validationErrors["general.period"]}
              required
            >
              <Select
                value={formData.period}
                onChange={(e) => handleInputChange("general", "period", e.target.value)}
                error={validationErrors["general.period"]}
              >
                <option value="">Select period</option>
                <option value="2024-Q1">2024 Q1</option>
                <option value="2024-Q2">2024 Q2</option>
                <option value="2024-Q3">2024 Q3</option>
                <option value="2024-Q4">2024 Q4</option>
                <option value="2023-Q4">2023 Q4</option>
                <option value="2023-Q3">2023 Q3</option>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Financial Data Input */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Statements</CardTitle>
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </CardHeader>
        <CardContent>
          {/* Income Statement Tab */}
          {activeTab === "income" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Revenue"
                  type="number"
                  value={formData.incomeStatement.revenue}
                  onChange={(e) => handleInputChange("incomeStatement", "revenue", e.target.value)}
                  error={validationErrors["incomeStatement.revenue"]}
                  placeholder="0"
                  required
                />
                <FormField
                  label="Cost of Goods Sold"
                  type="number"
                  value={formData.incomeStatement.costOfGoodsSold}
                  onChange={(e) => handleInputChange("incomeStatement", "costOfGoodsSold", e.target.value)}
                  error={validationErrors["incomeStatement.costOfGoodsSold"]}
                  placeholder="0"
                  required
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Gross Profit (Auto-calculated)</span>
                  <span className="text-lg font-bold text-green-900">
                    {formatCurrency(formData.incomeStatement.grossProfit)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Operating Expenses"
                  type="number"
                  value={formData.incomeStatement.operatingExpenses}
                  onChange={(e) => handleInputChange("incomeStatement", "operatingExpenses", e.target.value)}
                  error={validationErrors["incomeStatement.operatingExpenses"]}
                  placeholder="0"
                  required
                />
                <FormField
                  label="Interest Expense"
                  type="number"
                  value={formData.incomeStatement.interestExpense}
                  onChange={(e) => handleInputChange("incomeStatement", "interestExpense", e.target.value)}
                  error={validationErrors["incomeStatement.interestExpense"]}
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Operating Income</span>
                    <span className="text-lg font-bold text-blue-900">
                      {formatCurrency(formData.incomeStatement.operatingIncome)}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-800">Net Income</span>
                    <span className="text-lg font-bold text-primary-900">
                      {formatCurrency(formData.incomeStatement.netIncome)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Sheet Tab */}
          {activeTab === "balance" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Assets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Current Assets"
                    type="number"
                    value={formData.balanceSheet.currentAssets}
                    onChange={(e) => handleInputChange("balanceSheet", "currentAssets", e.target.value)}
                    error={validationErrors["balanceSheet.currentAssets"]}
                    placeholder="0"
                    required
                  />
                  <FormField
                    label="Total Assets"
                    type="number"
                    value={formData.balanceSheet.totalAssets}
                    onChange={(e) => handleInputChange("balanceSheet", "totalAssets", e.target.value)}
                    error={validationErrors["balanceSheet.totalAssets"]}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Liabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Current Liabilities"
                    type="number"
                    value={formData.balanceSheet.currentLiabilities}
                    onChange={(e) => handleInputChange("balanceSheet", "currentLiabilities", e.target.value)}
                    error={validationErrors["balanceSheet.currentLiabilities"]}
                    placeholder="0"
                    required
                  />
                  <FormField
                    label="Total Liabilities"
                    type="number"
                    value={formData.balanceSheet.totalLiabilities}
                    onChange={(e) => handleInputChange("balanceSheet", "totalLiabilities", e.target.value)}
                    error={validationErrors["balanceSheet.totalLiabilities"]}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Shareholder Equity (Auto-calculated)</span>
                  <span className="text-lg font-bold text-green-900">
                    {formatCurrency(formData.balanceSheet.shareholderEquity)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cash Flow Tab */}
          {activeTab === "cashflow" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Operating Cash Flow"
                  type="number"
                  value={formData.cashFlow.operatingCashFlow}
                  onChange={(e) => handleInputChange("cashFlow", "operatingCashFlow", e.target.value)}
                  error={validationErrors["cashFlow.operatingCashFlow"]}
                  placeholder="0"
                  required
                />
                <FormField
                  label="Investing Cash Flow"
                  type="number"
                  value={formData.cashFlow.investingCashFlow}
                  onChange={(e) => handleInputChange("cashFlow", "investingCashFlow", e.target.value)}
                  error={validationErrors["cashFlow.investingCashFlow"]}
                  placeholder="0 (negative for investments)"
                />
                <FormField
                  label="Financing Cash Flow"
                  type="number"
                  value={formData.cashFlow.financingCashFlow}
                  onChange={(e) => handleInputChange("cashFlow", "financingCashFlow", e.target.value)}
                  error={validationErrors["cashFlow.financingCashFlow"]}
                  placeholder="0 (negative for loan payments)"
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Net Cash Flow (Auto-calculated)</span>
                  <span className="text-lg font-bold text-green-900">
                    {formatCurrency(formData.cashFlow.netCashFlow)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Cash Flow Guidelines:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Operating cash flow should typically be positive</li>
                      <li>• Investing cash flow is often negative (investments in assets)</li>
                      <li>• Financing cash flow can be positive (raising capital) or negative (paying dividends/loans)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? "Saving..." : "Save & Analyze"}
        </Button>
      </div>
    </div>
  )
}

export default DataInput