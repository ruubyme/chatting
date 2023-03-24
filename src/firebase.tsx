// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3KVGL7k38MsFVDLVH3l0iFiU4pxtSYAY",
  authDomain: "chatting-d87d2.firebaseapp.com",
  databaseURL: "https://chatting-d87d2-default-rtdb.firebaseio.com",
  projectId: "chatting-d87d2",
  storageBucket: "chatting-d87d2.appspot.com",
  messagingSenderId: "791816366826",
  appId: "1:791816366826:web:010a4a9ae64ce8c5acc593",
  measurementId: "G-HFBMP77YWS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
