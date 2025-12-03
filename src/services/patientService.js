import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

export const createPatient = async (userId, patientData) => {
  try {
    const patientsRef = collection(db, 'patients', userId, 'patientList')
    const docRef = await addDoc(patientsRef, {
      ...patientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Paciente creado con ID:', docRef.id)
    return docRef
  } catch (error) {
    console.error('Error al crear paciente:', error)
    throw error
  }
}

export const getPatients = async (userId) => {
  try {
    const patientsRef = collection(db, 'patients', userId, 'patientList')
    const q = query(patientsRef, orderBy('name', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`${patients.length} pacientes obtenidos`)
    return patients
  } catch (error) {
    console.error('Error al obtener pacientes:', error)
    return []
  }
}

export const updatePatient = async (userId, patientId, updatedData) => {
  try {
    const patientRef = doc(db, 'patients', userId, 'patientList', patientId)
    await updateDoc(patientRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    })
    console.log('Paciente actualizado:', patientId)
  } catch (error) {
    console.error('Error al actualizar paciente:', error)
    throw error
  }
}

export const deletePatient = async (userId, patientId) => {
  try {
    const patientRef = doc(db, 'patients', userId, 'patientList', patientId)
    await deleteDoc(patientRef)
    console.log('Paciente eliminado:', patientId)
  } catch (error) {
    console.error('Error al eliminar paciente:', error)
    throw error
  }
}
