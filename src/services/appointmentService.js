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
  try {
    const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Cita creada con ID:', docRef.id)
    return docRef
  } catch (error) {
    console.error('Error al crear cita:', error)
    throw error
  }
}

export const getAppointments = async (userId) => {
  try {
    const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
    const q = query(appointmentsRef, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`${appointments.length} citas obtenidas`)
    return appointments
  } catch (error) {
    console.error('Error al obtener citas:', error)
    return []
  }
}

export const updateAppointment = async (userId, appointmentId, updatedData) => {
  try {
    const appointmentRef = doc(db, 'appointments', userId, 'appointmentList', appointmentId)
    await updateDoc(appointmentRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    })
    console.log('Cita actualizada:', appointmentId)
  } catch (error) {
    console.error('Error al actualizar cita:', error)
    throw error
  }
}

export const deleteAppointment = async (userId, appointmentId) => {
  try {
    const appointmentRef = doc(db, 'appointments', userId, 'appointmentList', appointmentId)
    await deleteDoc(appointmentRef)
    console.log('Cita eliminada:', appointmentId)
  } catch (error) {
    console.error('Error al eliminar cita:', error)
    throw error
  }
}

export const getAppointmentsByDate = async (userId, date) => {
  try {
    const appointmentsRef = collection(db, 'appointments', userId, 'appointmentList')
    const q = query(appointmentsRef, where('date', '==', date))
    const querySnapshot = await getDocs(q)
    
    const appointments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`${appointments.length} citas para ${date}`)
    return appointments
  } catch (error) {
    console.error('Error al obtener citas por fecha:', error)
    return []
  }
}
