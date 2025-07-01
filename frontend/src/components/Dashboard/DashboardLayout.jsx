import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ContinueWatching from "./ContinueWatching";
import CompletedSection from "./CompletedSection";
import ProfileCard from "./ProfileCard";
import XPChart from "./XPChart";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-orange-50 text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-orange-200">
                <Sidebar />
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <TopBar />

                {/* Dashboard Widgets */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column (2/3 on large screens) */}
                    <div className="lg:col-span-2 space-y-6">
                        <ContinueWatching />
                        <CompletedSection />
                    </div>

                    {/* Right column (1/3 on large screens) */}
                    <div className="space-y-6">
                        <ProfileCard />
                        <XPChart />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
