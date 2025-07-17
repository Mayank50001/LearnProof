import ProfileCard from "./ProfileCard";
import XPChart from "./XPChart";
import CompletedSection from "./CompletedSection";
import ContinueWatching from "./ContinueWatching";

const DashboardHome = () => (
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
);

export default DashboardHome;