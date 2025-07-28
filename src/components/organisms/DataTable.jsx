import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DataTable = ({ 
  title, 
  data = [], 
  columns = [], 
  editable = false, 
  onEdit,
  onDelete,
  className 
}) => {
  const [editingRow, setEditingRow] = useState(null)
  const [editData, setEditData] = useState({})

  const handleEdit = (row) => {
    setEditingRow(row.Id)
    setEditData(row)
  }

  const handleSave = () => {
    onEdit?.(editData)
    setEditingRow(null)
    setEditData({})
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditData({})
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {editable && (
            <Button size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {editable && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={row.Id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {editingRow === row.Id && column.editable ? (
                        <Input
                          value={editData[column.key] || ""}
                          onChange={(e) => handleInputChange(column.key, e.target.value)}
                          className="w-full"
                          type={column.type || "text"}
                        />
                      ) : (
                        <div className={cn(
                          "text-sm",
                          column.key === "value" && typeof row[column.key] === "number" 
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        )}>
                          {column.format ? column.format(row[column.key]) : row[column.key]}
                        </div>
                      )}
                    </td>
                  ))}
                  {editable && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingRow === row.Id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>
                            <ApperIcon name="Check" className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <ApperIcon name="X" className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
                            <ApperIcon name="Edit2" className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onDelete?.(row.Id)}
                            className="text-error hover:text-error hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DataTable