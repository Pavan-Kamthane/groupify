import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDb2u0_oggz04WU1Shl-SOAwzlL3hB9CfM",
    authDomain: "groupify1-ac317.firebaseapp.com",
    projectId: "groupify1-ac317",
    storageBucket: "groupify1-ac317.appspot.com",
    messagingSenderId: "39880737113",
    appId: "1:39880737113:web:8f30f4d95ad69fe5d5cc48",
    measurementId: "G-J50DQDKX0X" // Optional for your current needs
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);  // For Authentication
const db = getFirestore(app); // For Firestore
const storage = getStorage(app); // For Storage

export { auth, db, storage };
