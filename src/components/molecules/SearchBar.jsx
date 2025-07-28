import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  value,
  onChange
}) => {
  const [searchValue, setSearchValue] = useState(value || "")

  const handleChange = (e) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)
    onSearch?.(newValue)
  }

  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className="pl-10 pr-4"
      />
    </div>
  )
}

export default SearchBar