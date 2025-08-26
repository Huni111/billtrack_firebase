import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCAV29dYTFgb0irY34Mr2_rjCzu_vTXmBs",
  authDomain: "billtrack-8c64f.firebaseapp.com",
  projectId: "billtrack-8c64f",
  storageBucket: "billtrack-8c64f.firebasestorage.app",
  messagingSenderId: "964091695251",
  appId: "1:964091695251:web:f015f17271bfecb1ca3d66",
  measurementId: "G-7JMN8WK1WJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

