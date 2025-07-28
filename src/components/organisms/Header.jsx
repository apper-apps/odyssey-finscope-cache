import { useState } from "react"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Header = ({ onMenuClick, className }) => {
  const [selectedCompany, setSelectedCompany] = useState("acme-corp")

  const companies = [
    { value: "acme-corp", label: "Acme Corporation" },
    { value: "tech-solutions", label: "Tech Solutions Inc." },
    { value: "global-systems", label: "Global Systems Ltd." },
    { value: "innovation-hub", label: "Innovation Hub LLC" }
  ]

  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <label htmlFor="company-select" className="text-sm font-medium text-gray-700">
                Active Company:
              </label>
              <Select
                id="company-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="min-w-[200px]"
              >
                {companies.map((company) => (
                  <option key={company.value} value={company.value}>
                    {company.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <Button size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Analysis
            </Button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">John Analyst</p>
                <p className="text-xs text-gray-500">Senior Analyst</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header