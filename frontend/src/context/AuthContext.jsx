import { createContext , useContext , useEffect , useState } from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [token , setToken] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , async (firebaseUser) => {
            if(firebaseUser){
                setUser(firebaseUser);
                const idToken = await getIdToken(firebaseUser);
                setToken(idToken);
            } else{
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    } , [])

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{user , token , loading , logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth= ()=> useContext(AuthContext);