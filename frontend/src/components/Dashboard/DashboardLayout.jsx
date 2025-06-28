import React from 'react';
import Sidebar from './Sidebar';
// import ProfileCard from './ProfileCard';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-orange-50 text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md border-r border-orange-100 z-20">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <TopBar />
                <div className="p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 bg-white border-l border-orange-100 hidden lg:block shadow-sm">
                {/* <ProfileCard /> */}
            </aside>
        </div>
    );
};

export default DashboardLayout;
