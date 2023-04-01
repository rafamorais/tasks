import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.API_KEY_FIREBASE}`,
  authDomain: "task-project-ad7b9.firebaseapp.com",
  projectId: "task-project-ad7b9",
  storageBucket: "task-project-ad7b9.appspot.com",
  messagingSenderId: "921559559744",
  appId: "1:921559559744:web:5da7961c0734128b4639a5",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
export { db };
