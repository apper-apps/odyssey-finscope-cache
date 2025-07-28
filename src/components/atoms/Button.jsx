import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-hover focus:ring-primary-500/20 border border-primary-600",
    secondary: "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 focus:ring-primary-500/20",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500/20",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500/20",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-hover focus:ring-success/20",
    warning: "bg-gradient-secondary text-white hover:shadow-hover focus:ring-secondary-500/20",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-hover focus:ring-error/20"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button