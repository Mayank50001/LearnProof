import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-orange-50 text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-orange-200 ">
                <Sidebar />
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <TopBar />

                {/* Dashboard Widgets */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
