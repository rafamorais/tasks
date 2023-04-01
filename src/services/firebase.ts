import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMb0yf0jl-4V2eroue5rMHGr3aRtWZE6Q",
  authDomain: "task-project-ad7b9.firebaseapp.com",
  projectId: "task-project-ad7b9",
  storageBucket: "task-project-ad7b9.appspot.com",
  messagingSenderId: "921559559744",
  appId: "1:921559559744:web:5da7961c0734128b4639a5",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
export { db };
