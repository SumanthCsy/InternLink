import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB73eQi7bsB9lvUabER8zmNr8DSefkQN8I",
  authDomain: "techie-internships.firebaseapp.com",
  projectId: "techie-internships",
  storageBucket: "techie-internships.appspot.com",
  messagingSenderId: "282583736584",
  appId: "1:282583736584:web:d25d1881bbcaa32ebf8cbd",
  measurementId: "G-00D66858W3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
