import LandingPage from "./components/Landing"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            
          </ProtectedRoute>
        }
      />
    </Routes>
    </BrowserRouter>
  )
}

export default App
