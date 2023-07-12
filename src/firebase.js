import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXPPUucwkSqNZ5SRtShUr4rd5XMuKvqzU",
  authDomain: "skill-tree-ce149.firebaseapp.com",
  projectId: "skill-tree-ce149",
  storageBucket: "skill-tree-ce149.appspot.com",
  messagingSenderId: "500820643364",
  appId: "1:500820643364:web:ec4c2758096f3ba8afd2b1",
  measurementId: "G-LHRNBGCFSX"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth(firebaseApp)

export { db, auth };