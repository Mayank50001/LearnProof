// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV96gY3SvsfMtiu7F_NdZlrR5a5ecxxs8",
  authDomain: "learnproof.firebaseapp.com",
  projectId: "learnproof",
  storageBucket: "learnproof.firebasestorage.app",
  messagingSenderId: "74980993962",
  appId: "1:74980993962:web:6982678c8b00970b08d9d3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };