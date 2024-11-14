import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbYDL5ieLFWtqcl8cw0CkEG5UUDRbP1jw",
  authDomain: "quickloot-12c81.firebaseapp.com",
  projectId: "quickloot-12c81",
  storageBucket: "quickloot-12c81.appspot.com",
  messagingSenderId: "822580389845",
  appId: "1:822580389845:web:a96ba3fae3e6ccefb0ff5c",
  measurementId: "G-LJJHYG0QW5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
