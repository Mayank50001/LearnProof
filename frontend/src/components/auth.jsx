import { auth, provider, signInWithPopup, signOut } from '../firebase';

export const handleLogin = async (setUser) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const userData = result.user;
        setUser(userData);
  
        const token = await userData.getIdToken();
  
        localStorage.setItem('idToken' , token);
  
        const res = await fetch('http://localhost:8000/api/users/firebase-login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: token }),
        });
  
        const data = await res.json();
        console.log('Backend response: ', data);
      } catch (err) {
        console.error('Login error: ', err);
      }
      
} 

// 🔁 Logout Function
export const handleLogout = async (setUser) => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("idToken");
    } catch (err) {
      console.error("Logout error: ", err);
    }
};