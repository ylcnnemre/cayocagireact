// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9Y5vjWdho8phuUepGA5-vO0l06Zjchlc",
    authDomain: "cayocagi-3002c.firebaseapp.com",
    projectId: "cayocagi-3002c",
    storageBucket: "cayocagi-3002c.appspot.com",
    messagingSenderId: "522704052310",
    appId: "1:522704052310:web:12644923d990db004d1bf7",
    measurementId: "G-MEL5S7RW62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)