
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, Timestamp, getDoc } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyBuzm6-xNBaEr_3iTK8Xfjv14udE_99LI8",
  authDomain: "tazkia-3db79.firebaseapp.com",
  projectId: "tazkia-3db79",
  storageBucket: "tazkia-3db79.firebasestorage.app",
  messagingSenderId: "773328533371",
  appId: "1:773328533371:web:607613793e0efc950aafde",
  measurementId: "G-7R6PLMR0C3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-zikr-app';

export { auth, db, appId, onAuthStateChanged, signInAnonymously, signInWithCustomToken, doc, setDoc, onSnapshot, collection, query, Timestamp, getDoc };
