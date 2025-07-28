import metricsMock from "@/services/mockData/metricsMock.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MetricsService {
  constructor() {
    this.data = [...metricsMock]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error(`Metrics with ID ${id} not found`)
    }
    return { ...item }
  }

  async getByFinancialDataId(financialDataId) {
    await delay(250)
    const item = this.data.find(item => item.financialDataId === financialDataId.toString())
    if (!item) {
      throw new Error(`Metrics for financial data ID ${financialDataId} not found`)
    }
    return { ...item }
  }

  async calculateMetrics(financialData) {
    await delay(400)
    
    const { incomeStatement, balanceSheet, cashFlow } = financialData
    
    // Calculate liquidity ratios
    const liquidityRatios = {
      currentRatio: balanceSheet.currentAssets / balanceSheet.currentLiabilities,
      quickRatio: (balanceSheet.currentAssets * 0.8) / balanceSheet.currentLiabilities,
      cashRatio: (balanceSheet.currentAssets * 0.25) / balanceSheet.currentLiabilities
    }

    // Calculate profitability ratios
    const profitabilityRatios = {
      grossProfitMargin: (incomeStatement.grossProfit / incomeStatement.revenue) * 100,
      operatingMargin: (incomeStatement.operatingIncome / incomeStatement.revenue) * 100,
      netProfitMargin: (incomeStatement.netIncome / incomeStatement.revenue) * 100,
      returnOnAssets: (incomeStatement.netIncome / balanceSheet.totalAssets) * 100,
      returnOnEquity: (incomeStatement.netIncome / balanceSheet.shareholderEquity) * 100
    }

    // Calculate efficiency ratios
    const efficiencyRatios = {
      assetTurnover: incomeStatement.revenue / balanceSheet.totalAssets,
      inventoryTurnover: incomeStatement.costOfGoodsSold / (balanceSheet.totalAssets * 0.15),
      receivablesTurnover: incomeStatement.revenue / (balanceSheet.currentAssets * 0.3)
    }

    // Calculate leverage ratios
    const leverageRatios = {
      debtToEquity: balanceSheet.totalLiabilities / balanceSheet.shareholderEquity,
      debtToAssets: balanceSheet.totalLiabilities / balanceSheet.totalAssets,
      interestCoverage: incomeStatement.operatingIncome / incomeStatement.interestExpense
    }

    const calculatedMetrics = {
      financialDataId: financialData.Id.toString(),
      liquidityRatios,
      profitabilityRatios,
      efficiencyRatios,
      leverageRatios
    }

    return calculatedMetrics
  }

  async create(item) {
    await delay(350)
    const newId = Math.max(...this.data.map(d => d.Id), 0) + 1
    const newItem = {
      ...item,
      Id: newId
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, updatedData) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Metrics with ID ${id} not found`)
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updatedData,
      Id: parseInt(id)
    }
    return { ...this.data[index] }
  }
}

export default new MetricsService()