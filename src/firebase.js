import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where,getDoc, getDocs, serverTimestamp, doc, updateDoc,deleteDoc,orderBy,limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBE6men-JHpOXW8NMbZXi60o2k1kMUB01s",
    authDomain: "store-management-ee604.firebaseapp.com",
    projectId: "store-management-ee604",
    storageBucket: "store-management-ee604.appspot.com",
    messagingSenderId: "364712732021",
    appId: "1:364712732021:web:74709799d0103f7d961f3c",
    measurementId: "G-W503L9N9KN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, query, where,getDoc, getDocs, serverTimestamp,doc, updateDoc,deleteDoc,orderBy,limit };