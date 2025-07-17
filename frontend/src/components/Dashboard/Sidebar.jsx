import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Inbox, Award, LogOut, Quote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', icon: <Home size={20} />, path: '/dashboard' },
        { name: 'My Learnings', icon: <BookOpen size={20} />, path: '/dashboard/library' },
        { name: 'Inbox', icon: <Inbox size={20} />, path: '/dashboard/inbox' },
        { name: 'Certificates', icon: <Award size={20} />, path: '/dashboard/certificates' },
        { name: 'Quiz' , icon: <Quote size={20} />, path: '/dashboard/quiz' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="fixed h-full flex flex-col justify-between p-6 space-y-8">
            <div>
                {/* Logo */}
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-8">
                    LearnProof
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-orange-100 text-orange-700 font-semibold'
                                        : 'text-gray-700 hover:bg-orange-50'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm"
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
