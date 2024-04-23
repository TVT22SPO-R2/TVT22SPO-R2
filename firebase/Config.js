
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, query, doc, getDocs, where, updateDoc, setDoc } from "firebase/firestore";
import { getReactNativePersistence, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const firestore = getFirestore();
// const auth = getAuth();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const storage = getStorage(app);


export {
  firestore,
  collection,
  addDoc,
  deleteDoc,
  query,
  doc,
  getDocs,
  where,
  updateDoc,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  storage,
  setDoc
}


