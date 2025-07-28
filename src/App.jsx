import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import DataInput from "@/components/pages/DataInput"
import Analysis from "@/components/pages/Analysis"
import Reports from "@/components/pages/Reports"
import Settings from "@/components/pages/Settings"

function App() {
  // Set document title for personal finance focus
  document.title = "Personal Finance Analyzer - Track Your Financial Goals"
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="data-input" element={<DataInput />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </BrowserRouter>
  )
}

export default App