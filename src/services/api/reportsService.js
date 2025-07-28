import reportsMock from "@/services/mockData/reportsMock.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ReportsService {
  constructor() {
    this.data = [...reportsMock]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error(`Report with ID ${id} not found`)
    }
    return { ...item }
  }

  async create(item) {
    await delay(500)
    const newId = Math.max(...this.data.map(d => d.Id), 0) + 1
    const newItem = {
      ...item,
      Id: newId,
      generatedAt: new Date().toISOString()
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, updatedData) {
    await delay(400)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Report with ID ${id} not found`)
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updatedData,
      Id: parseInt(id)
    }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Report with ID ${id} not found`)
    }
    
    const deletedItem = { ...this.data[index] }
    this.data.splice(index, 1)
    return deletedItem
  }

  async getByFinancialDataId(financialDataId) {
    await delay(300)
    return this.data.filter(item => item.financialDataId === financialDataId.toString())
  }

  async generateReport(financialDataId, template) {
    await delay(800)
    const newReport = {
      financialDataId: financialDataId.toString(),
      title: template.title || `Financial Analysis Report - ${new Date().toLocaleDateString()}`,
      sections: template.sections || [],
      charts: template.charts || [],
      generatedAt: new Date().toISOString()
    }
    
    return this.create(newReport)
  }
}

export default new ReportsService()