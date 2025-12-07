// Firebase Configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyAfKteHVznFEyolYknlaY4Mv0SW3BDTYMg",
  authDomain: "appointment-system-217f7.firebaseapp.com",
  databaseURL: "https://appointment-system-217f7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "appointment-system-217f7",
  storageBucket: "appointment-system-217f7.firebasestorage.app",
  messagingSenderId: "90543625648",
  appId: "1:90543625648:web:107dcd3fb1dc6b78b17275",
  measurementId: "G-RBKT71H7CZ"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
