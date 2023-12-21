import {
  FIREBASE_API_KEY,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_APP_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
} from "@env";
import { getFirestore, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  appId: FIREBASE_APP_ID,
  projectId: FIREBASE_PROJECT_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);
const fbStorage = getStorage();
const db = getFirestore(app);
const auth = getAuth(app);

// const auth = initializeAuth(fbApp, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
/**
 *
 * @param {*} uri
 * @param {*} name
 */
const uploadToFirebase = async (uri, name, isPhoto, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const uploadRef = ref(getStorage(), `${isPhoto ? "images" : "videos"}/${name}`);

  const uploadTask = uploadBytesResumable(uploadRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
};

export {
  app,
  fbStorage,
  db,
  ref,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  uploadToFirebase,
  deleteObject,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
