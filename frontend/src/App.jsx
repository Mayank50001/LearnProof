import LandingPage from "./components/Landing"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import React from "react"
import DashboardLayout from "./components/Dashboard/DashboardLayout"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
    </BrowserRouter>
  )
}

export default App
