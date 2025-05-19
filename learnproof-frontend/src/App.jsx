import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CourseWatcher from "./pages/CourseWatcher";
import Navbar from "./components/Navbar";

function App(){
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/watch" element={<CourseWatcher />} />
        </Routes>
    </Router>
  )
}

export default App;