import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Error = ({ 
  message = "Something went wrong while loading data.", 
  onRetry,
  className 
}) => {
  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry}>
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button variant="outline">
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Error