import { motion } from "framer-motion"
import NavigationItem from "@/components/molecules/NavigationItem"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose, className }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/data-input", icon: "FileText", label: "Data Input" },
    { to: "/analysis", icon: "BarChart3", label: "Analysis" },
    { to: "/reports", icon: "FileBarChart", label: "Reports" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ]

  return (
    <>
      {/* Desktop Sidebar - Static */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0", className)}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">FinScope Pro</h1>
                  <p className="text-xs text-gray-500">Financial Analysis</p>
                </div>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-4 space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem key={item.to} {...item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Financial Team</p>
                <p className="text-xs text-gray-500 truncate">Premium Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">FinScope Pro</h1>
                    <p className="text-xs text-gray-500">Financial Analysis</p>
                  </div>
                </div>
              </div>
              <nav className="mt-5 px-4 space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.to} {...item} onClick={onClose} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card">
                <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Financial Team</p>
                  <p className="text-xs text-gray-500 truncate">Premium Account</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Sidebar