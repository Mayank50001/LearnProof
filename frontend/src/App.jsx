import { useState } from 'react';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import Landing from './components/Landing';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);

      const token = await userData.getIdToken();

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
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      <Landing onGetStarted={handleLogin} user={user} />
      {user && (
        <div className="flex flex-col items-center mt-4">
          <img src={user.photoURL} className="w-16 h-16 rounded-full" alt="Profile" />
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-800 rounded-xl transition-all text-white px-6 py-2"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
