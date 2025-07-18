import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Landing';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import MyCertificates from './components/Dashboard/MyCertificates';
import MyLearnings from './components/Dashboard/MyLearnings';
import Inbox from './components/Dashboard/Inbox';
import ProtectedRoute from "./routes/ProtectedRoute"
import { AuthProvider } from './context/AuthContext';
import Quiz from './components/Dashboard/Quiz';
import Classroom from './components/Classroom';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<LandingPage />}/>

                    <Route
                        path='/dashboard/*'
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardHome />} />
                        <Route path="library" element={<MyLearnings />} />
                        <Route path="certificates" element={<MyCertificates />} />
                        <Route path='inbox' element={<Inbox />} />
                        <Route path='quiz' element={<Quiz />}/>
                        
                    </Route>
                    <Route path='classroom/:videoId' element={<Classroom />}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
