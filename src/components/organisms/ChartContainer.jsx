import React, { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const ChartContainer = ({ 
  title, 
  type = "line", 
  data = [], 
  categories = [],
  height = 350,
  className,
  options = {}
}) => {
  const [chartOptions, setChartOptions] = useState({})

const memoizedOptions = useMemo(() => {
    const baseOptions = {
      chart: {
        type: type || 'line',
        height: height || 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        background: "transparent"
      },
      colors: ["#1e3a5f", "#f39c12", "#3498db", "#27ae60", "#e74c3c"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      xaxis: {
        categories: categories || [],
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "12px"
          },
          formatter: function (val) {
            return typeof val === "number" ? val.toLocaleString() : val
          }
        }
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        fontWeight: 500,
        labels: {
          colors: "#374151"
        }
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px"
        }
      },
      ...(options || {})
    }

    return baseOptions
  }, [type, height, categories, JSON.stringify(options || {})])

  useEffect(() => {
    setChartOptions(memoizedOptions)
  }, [memoizedOptions])

  return (
    <Card className={cn("chart-container", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={data}
            type={type}
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ChartContainer