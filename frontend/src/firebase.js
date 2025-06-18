import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider, signInWithPopup , signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAV96gY3SvsfMtiu7F_NdZlrR5a5ecxxs8",
    authDomain: "learnproof.firebaseapp.com",
    projectId: "learnproof",
    storageBucket: "learnproof.firebasestorage.app",
    messagingSenderId: "74980993962",
    appId: "1:74980993962:web:6982678c8b00970b08d9d3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };