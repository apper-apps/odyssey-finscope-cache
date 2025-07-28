import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  className,
  subtitle,
  trend = []
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error", 
    neutral: "text-gray-500"
  }

  const changeIcons = {
    positive: "TrendingUp",
    negative: "TrendingDown",
    neutral: "Minus"
  }

  return (
    <Card className={cn("metric-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && (
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <ApperIcon name={icon} className="h-4 w-4 text-white" />
                </div>
              )}
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            
            <div className="mb-2">
              <p className="text-2xl font-bold gradient-text">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>

            {change && (
              <div className={cn("flex items-center gap-1 text-sm", changeColors[changeType])}>
                <ApperIcon name={changeIcons[changeType]} className="h-3 w-3" />
                <span className="font-medium">{change}</span>
                <span className="text-gray-500">vs last period</span>
              </div>
            )}
          </div>

          {trend.length > 0 && (
            <div className="flex items-end gap-1 h-8 ml-4">
              {trend.slice(-8).map((point, index) => (
                <div
                  key={index}
                  className="w-1.5 bg-gradient-primary rounded-full opacity-60"
                  style={{ height: `${Math.max(4, (point / Math.max(...trend)) * 24)}px` }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard