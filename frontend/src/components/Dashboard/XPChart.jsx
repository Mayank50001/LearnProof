import { useEffect, useState } from "react";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import toast from "react-hot-toast";

const XPChart = () => {
    const { token } = useAuth();
    const [data , setData] = useState([]);
    const [loading , setLoading] = useState(true);

    useEffect(()=>{
        if(!token) return;
        const fetchXPData = async () =>{
            const loadingToast = toast.loading("loading...");
            try{
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/activity/` , {
                    idToken : token,
                });
                setData(res.data.graph || []);
                toast.success("Loaded!" , {id: loadingToast});
            }
            catch (err){
                toast.error("Failed to load, check server logs" , {id : loadingToast});
                console.error("Failed to fetch XP chart data: " ,err);
            }
            finally{
                setLoading(false);
            }
        }

        fetchXPData();
    } , [token]);

    if (loading) {
    return (
      <div className="w-full h-66 p-2 pb-8 bg-white rounded-xl border border-orange-200 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 w-1/2 rounded mb-3"></div>
        <div className="h-48 bg-gray-100 rounded"></div>
      </div>
    );
  }

    return (
        <div className="w-full h-66 p-2 pb-8 bg-white rounded-xl border border-orange-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800" >XP Chart</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#fff", borderColor: "#f97316" }}
                        cursor={{ fill: "#fef3c7" }}
                    />
                    <Bar dataKey="activity_count" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default XPChart;