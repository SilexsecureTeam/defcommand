import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "defcomm-tracker.firebaseapp.com",
  databaseURL: "https://defcomm-tracker-default-rtdb.firebaseio.com",
  projectId: "defcomm-tracker",
  storageBucket: "defcomm-tracker.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
