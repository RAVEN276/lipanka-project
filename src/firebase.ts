// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByrVWylTXiW5-Lk1KiStAc70YTteMA5bc",
  authDomain: "nusa-quest-prototype.firebaseapp.com",
  projectId: "nusa-quest-prototype",
  storageBucket: "nusa-quest-prototype.firebasestorage.app",
  messagingSenderId: "127910489204",
  appId: "1:127910489204:web:994dc6dfa1de0c5aecb521",
  measurementId: "G-WY9GMQ457Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
