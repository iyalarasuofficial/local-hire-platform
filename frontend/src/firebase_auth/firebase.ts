// src/firebase_auth/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvsW7QPSwE9a7-STgLn58ZbCIa9fuif3E",
  authDomain: "local-hire-b0d98.firebaseapp.com",
  projectId: "local-hire-b0d98",
  storageBucket: "local-hire-b0d98.appspot.com",
  messagingSenderId: "315213450551",
  appId: "1:315213450551:web:35c9a86de8e7d0698a1eb2",
  measurementId: "G-QYLD7B05J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only auth since you're not using Firestore
export const auth = getAuth(app);
