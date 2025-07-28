import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const NavigationItem = ({ to, icon, label, badge, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-primary text-white shadow-card"
            : "text-gray-600 hover:text-primary-600 hover:bg-primary-50",
          className
        )
      }
    >
      <ApperIcon name={icon} className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export default NavigationItem