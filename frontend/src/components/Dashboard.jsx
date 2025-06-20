import { useState , useEffect } from "react";
import Navbar from "./Navbar";
import ImportTab from "./ImportTab";
import ProgressTab from "./ProgressTab";
import CertificatesTab from "./CertificatesTab";


export default function Dashboard({onLogout}) {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("import");

    const renderTab = () => {
        if (activeTab === "Import") return <ImportTab />;
        if (activeTab === "Progress") return <ProgressTab />;
        if (activeTab === "Certificates") return <CertificatesTab />;
    }
    useEffect(() => {
        const token = localStorage.getItem("idToken");
        
        const fetchProfile = async () => {
            const res = await fetch("http://localhost:8000/api/firebase-login/" , {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({ idToken: token }),
            });

            const data = await res.json();
            if(data?.user){
                setUser(data.user);
            }
        };
        fetchProfile();
    } , []);

    return (
        <div>
            <Navbar onLogout={onLogout} user={user} />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                {user ? (
                    <>
                        <div className="flex space-x-4 mb-6">
                            <button className={`px-4 py-2 rounded ${
                                    activeTab === "Import" ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`} onClick={() => setActiveTab("Import")}>
                                    📥 Import
                            </button>
                            <button className={`px-4 py-2 rounded ${
                                    activeTab === "Progress" ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`} onClick={() => setActiveTab("Progress")}>
                                    📈 Progress
                            </button>
                            <button className={`px-4 py-2 rounded ${
                                    activeTab === "Certificates" ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`} onClick={() => setActiveTab("Certificates")}>
                                    🏅 Certificates
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded shadow-md">
                            {renderTab()}
                        </div>
                    </>
                ) : (
                    <p className="p-4">Loading user data.....</p>
                )}
            </div>
        </div>
    )

    

}