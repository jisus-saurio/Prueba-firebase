import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
 apiKey: "AIzaSyBQO6y9X7cN_h_Ngqw2znkh8FoFvs0PAgQ",
  authDomain: "practica-firebase-202003-c7530.firebaseapp.com",
  projectId: "practica-firebase-202003-c7530",
  storageBucket: "practica-firebase-202003-c7530.firebasestorage.app",
  messagingSenderId: "102339275864",
  appId: "1:102339275864:web:483beb54b063ff89a32e2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;