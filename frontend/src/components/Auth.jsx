import { useEffect , useState } from "react";
import { auth, provider , signInWithPopup , signOut } from "../firebase";

const Auth = () => {
    const [user , setUser] = useState(null);

    const handleLogin = async () => {
        try{
            const result = await signInWithPopup(auth , provider);
            const userData = result.user;
            setUser(userData);
        } catch(err){
            console.error("Login error: " , err);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            {!user ? (
                <button
                    onClick={handleLogin}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md"
                >
                    Sign in with Google
                </button>
            ) : (
                <>
                    <img src="{user.photoURL}" className="w-16 h-16 rounded-full" alt="Profile" />
                    <h2 className="text-lg font-semibold">{user.displayName}</h2>
                    <p>{user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-700 text-white px-6 py-2 rounded-xl"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    );
};

export default Auth;