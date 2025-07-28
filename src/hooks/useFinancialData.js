import { useState, useEffect } from "react"
import financialDataService from "@/services/api/financialDataService"
import { toast } from "react-toastify"

export const useFinancialData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await financialDataService.getAll()
      setData(result)
    } catch (err) {
      setError(err.message || "Failed to load financial data")
      toast.error("Failed to load financial data")
    } finally {
      setLoading(false)
    }
  }

  const createData = async (newData) => {
    setError("")
    try {
      const result = await financialDataService.create(newData)
      setData(prev => [...prev, result])
      toast.success("Financial data created successfully")
      return result
    } catch (err) {
      setError(err.message || "Failed to create financial data")
      toast.error("Failed to create financial data")
      throw err
    }
  }

  const updateData = async (id, updatedData) => {
    setError("")
    try {
      const result = await financialDataService.update(id, updatedData)
      setData(prev => prev.map(item => item.Id === parseInt(id) ? result : item))
      toast.success("Financial data updated successfully")
      return result
    } catch (err) {
      setError(err.message || "Failed to update financial data")
      toast.error("Failed to update financial data")
      throw err
    }
  }

  const deleteData = async (id) => {
    setError("")
    try {
      await financialDataService.delete(id)
      setData(prev => prev.filter(item => item.Id !== parseInt(id)))
      toast.success("Financial data deleted successfully")
    } catch (err) {
      setError(err.message || "Failed to delete financial data")
      toast.error("Failed to delete financial data")
      throw err
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    data,
    loading,
    error,
    loadData,
    createData,
    updateData,
    deleteData
  }
}

export default useFinancialData