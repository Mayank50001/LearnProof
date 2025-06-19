// This component renders a navigation bar with a user name and a logout button.
// It uses Firebase authentication to handle user sign-out and redirects to the home page after logout.
import { getAuth, signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";

// This function takes user data as a prop and renders a navigation bar with the user's name and a logout button.
// When the logout button is clicked, it signs out the user from Firebase and removes the token
// from localStorage, then redirects the user to the home page.
export default function Navbar({onLogout , user}){
    const navigate = useNavigate();

    const handleLogout = async () => {
        await onLogout();
        navigate("/");
    }

    // JSX to render the navigation bar with a nav bar having heading and user name and logout button.
    return (
        <nav className="bg-gray-500 text-white p-4 flex justify-between items-center">
            <h1 className="font-bold text-xl">LearnProof</h1>
            <div className="flex items-center gap-4">
                <span>{user?.name || "User"}</span>
                <button onClick={handleLogout} className="bg-red-500 rounded px-3 py-1">
                    Logout
                </button>
            </div>
        </nav>
    );
};