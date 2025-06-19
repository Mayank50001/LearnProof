import { useState } from 'react';
import Landing from './components/Landing';
import { BrowserRouter , Routes , Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import { Navigate } from 'react-router-dom';
import { handleLogin , handleLogout } from './components/auth';

function App() {

  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path = "/"
          element = {<Landing onGetStarted={() => handleLogin(setUser)} user={user} />}
        />
        <Route 
          path = "/dashboard"
          element = {
            <ProtectedRoute>
              <Dashboard onLogout={() => handleLogout(setUser)} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
