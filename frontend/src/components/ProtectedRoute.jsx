// This component checks if a user is authenticated by verifying the presence of a token in localStorage.
//imports navigate from react router-dom to redirect unauthenticated users to the home page.
import { Navigate } from "react-router-dom";

// ProtectedRoute arrow function checks if a user is authenticated by verifying the presence of a token in localStorage.
// If the token exists, it renders the children components; otherwise, it redirects the user to
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("idToken");

    return token ? children : <Navigate to="/" replace />;

};

export default ProtectedRoute;