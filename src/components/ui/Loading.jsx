import { cn } from "@/utils/cn"

const Loading = ({ className, rows = 5, showHeader = false }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-48 shimmer"></div>
          <div className="h-8 bg-gray-200 rounded w-24 shimmer"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 shimmer mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32 shimmer"></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-5 bg-gray-200 rounded w-32 shimmer mb-4"></div>
        <div className="space-y-3">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded flex-1 shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading