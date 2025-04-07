import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const storageBucket="project1-618a9.firebasestorage.app";
const firebaseApp = initializeApp({

    //daniel's firebase
    // apiKey: "AIzaSyBTHvalVjj0mJtSea-H9fmzBW1khbj79kA",
    // authDomain: "ecommerce-a91ab.firebaseapp.com",
    // projectId: "ecommerce-a91ab",
    // storageBucket: "ecommerce-a91ab.firebasestorage.app",
    // messagingSenderId: "905005446213",
    // appId: "1:905005446213:web:711ea8c45438f2194adf2c",
    // measurementId: "G-14867TFB6Q"

    apiKey: "AIzaSyCj5hFE--xmHXFPgzs4toLfhQdBKqipp9o",
    authDomain: "project1-618a9.firebaseapp.com",
    projectId: "project1-618a9",
    storageBucket: storageBucket,
    messagingSenderId: "52140039322",
    appId: "1:52140039322:web:b869fed9f3cad2a8ae1323",
    measurementId: "G-SQ4VF0SY7D"


});

export const app = firebaseApp;
export const db = getFirestore();
export const auth = getAuth(app)
export const storage = getStorage();



