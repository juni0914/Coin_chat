import { initializeApp } from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9Rzx7tphONbN3c38HtQJ82eGu0mdemvw",
  authDomain: "react-chatapp-ed63e.firebaseapp.com",
  projectId: "react-chatapp-ed63e",
  storageBucket: "react-chatapp-ed63e.appspot.com",
  messagingSenderId: "1026467982923",
  appId: "1:1026467982923:web:afdb5ad15eb0f67d8be7ce",
  measurementId: "G-FZPYJ72N1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;