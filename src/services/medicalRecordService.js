import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy 
} from 'firebase/firestore'
import { db } from './firebase'

export const createMedicalRecord = async (userId, recordData) => {
  const recordsRef = collection(db, 'medicalRecords', userId, 'records')
  return await addDoc(recordsRef, {
    ...recordData,
    createdAt: new Date().toISOString()
  })
}

export const getMedicalRecords = async (userId) => {
  const recordsRef = collection(db, 'medicalRecords', userId, 'records')
  const q = query(recordsRef, orderBy('date', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const getMedicalRecordsByPatient = async (userId, patientId) => {
  const recordsRef = collection(db, 'medicalRecords', userId, 'records')
  const q = query(recordsRef, where('patientId', '==', patientId), orderBy('date', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const updateMedicalRecord = async (userId, recordId, updatedData) => {
  const recordRef = doc(db, 'medicalRecords', userId, 'records', recordId)
  await updateDoc(recordRef, {
    ...updatedData,
    updatedAt: new Date().toISOString()
  })
}

export const deleteMedicalRecord = async (userId, recordId) => {
  const recordRef = doc(db, 'medicalRecords', userId, 'records', recordId)
  await deleteDoc(recordRef)
}
