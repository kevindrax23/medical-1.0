import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  
  await updateProfile(user, { displayName: userData.name })
  
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: email,
    name: userData.name,
    role: userData.role || 'doctor',
    clinicName: userData.clinicName,
    specialty: userData.specialty,
    createdAt: new Date().toISOString(),
    settings: {
      appointmentDuration: 30,
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: [1, 2, 3, 4, 5]
    }
  })
  
  return user
}

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const getUserData = async (uid) => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}
