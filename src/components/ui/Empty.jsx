import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first financial data entry.",
  icon = "FileText",
  actionLabel = "Add Data",
  onAction,
  className 
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="flex gap-3 justify-center">
          {onAction && (
            <Button onClick={onAction}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
          
          <Button variant="outline">
            <ApperIcon name="BookOpen" className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Empty