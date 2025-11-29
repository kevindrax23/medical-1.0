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

export const createAppointment = async (userId, appointmentData) => {
  const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
  return await addDoc(appointmentsRef, {
    ...appointmentData,
    createdAt: new Date().toISOString()
  })
}

export const getAppointments = async (userId) => {
  const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
  const q = query(appointmentsRef, orderBy('date', 'desc'))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const updateAppointment = async (userId, appointmentId, updatedData) => {
  const appointmentRef = doc(db, 'appointments', userId, 'appointmentList', appointmentId)
  await updateDoc(appointmentRef, {
    ...updatedData,
    updatedAt: new Date().toISOString()
  })
}

export const deleteAppointment = async (userId, appointmentId) => {
  const appointmentRef = doc(db, 'appointments', userId, 'appointmentList', appointmentId)
  await deleteDoc(appointmentRef)
}

export const getAppointmentsByDate = async (userId, date) => {
  const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
  const q = query(appointmentsRef, where('date', '==', date))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
