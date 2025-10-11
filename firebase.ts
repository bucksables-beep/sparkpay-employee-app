
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAFe67_uB66i9diV1C-kO_eqVjnuXaRBs",
  authDomain: "employee-app-80906.firebaseapp.com",
  projectId: "employee-app-80906",
  storageBucket: "employee-app-80906.appspot.com",
  messagingSenderId: "621003291433",
  appId: "1:621003291433:web:97a224590e00798dd75538",
  measurementId: "G-DFPJB9HM6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
