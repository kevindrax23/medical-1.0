import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from './firebase'

export const createPatient = async (userId, patientData) => {
  const patientsRef = collection(db, 'patients', userId, 'patientList')
  return await addDoc(patientsRef, {
    ...patientData,
    createdAt: new Date().toISOString()
  })
}

export const getPatients = async (userId) => {
  const patientsRef = collection(db, 'patients', userId, 'patientList')
  const q = query(patientsRef, orderBy('name', 'asc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const updatePatient = async (userId, patientId, updatedData) => {
  const patientRef = doc(db, 'patients', userId, 'patientList', patientId)
  await updateDoc(patientRef, {
    ...updatedData,
    updatedAt: new Date().toISOString()
  })
}

export const deletePatient = async (userId, patientId) => {
  const patientRef = doc(db, 'patients', userId, 'patientList', patientId)
  await deleteDoc(patientRef)
}
