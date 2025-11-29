import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyALnOkpX45SwVWZQfG5xZsELizgI4fVRE4",
  authDomain: "edusoft-ba6a5.firebaseapp.com",
  projectId: "edusoft-ba6a5",
  storageBucket: "edusoft-ba6a5.firebasestorage.app",
  messagingSenderId: "644188186903",
  appId: "1:644188186903:web:67d452b84ac7194f202f52",
  measurementId: "G-R4J1310SV0"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
