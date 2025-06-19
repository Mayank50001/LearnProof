import { useState , useEffect } from "react";
import Navbar from "./Navbar";

export default function Dashboard({onLogout}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("idToken");
        
        const fetchProfile = async () => {
            const res = await fetch("http://localhost:8000/api/users/firebase-login/" , {
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
                    <div className="bg-white p-4 rounded shadow-md">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>UID:</strong> {user.username}</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    )

    

}