import financialDataMock from "@/services/mockData/financialDataMock.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class FinancialDataService {
  constructor() {
    this.data = [...financialDataMock]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error(`Financial data with ID ${id} not found`)
    }
    return { ...item }
  }

  async create(item) {
    await delay(400)
    const newId = Math.max(...this.data.map(d => d.Id), 0) + 1
    const newItem = {
      ...item,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, updatedData) {
    await delay(350)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Financial data with ID ${id} not found`)
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updatedData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Financial data with ID ${id} not found`)
    }
    
    const deletedItem = { ...this.data[index] }
    this.data.splice(index, 1)
    return deletedItem
  }

  async getByCompany(companyName) {
    await delay(300)
    return this.data.filter(item => 
      item.companyName.toLowerCase().includes(companyName.toLowerCase())
    )
  }

  async getByPeriod(period) {
    await delay(300)
    return this.data.filter(item => item.period === period)
  }
}

export default new FinancialDataService()