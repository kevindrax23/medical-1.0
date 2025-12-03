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
  try {
    const recordsRef = collection(db, 'medicalRecords', userId, 'records')
    const docRef = await addDoc(recordsRef, {
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('✅ Historia clínica creada con ID:', docRef.id)
    return docRef
  } catch (error) {
    console.error('Error al crear historia clínica:', error)
    throw error
  }
}

export const getMedicalRecords = async (userId) => {
  try {
    const recordsRef = collection(db, 'medicalRecords', userId, 'records')
    const q = query(recordsRef, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`${records.length} historias clínicas obtenidas`)
    return records
  } catch (error) {
    console.error('Error al obtener historias clínicas:', error)
    return []
  }
}

export const getMedicalRecordsByPatient = async (userId, patientId) => {
  try {
    const recordsRef = collection(db, 'medicalRecords', userId, 'records')
    const q = query(recordsRef, where('patientId', '==', patientId), orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`${records.length} historias para paciente ${patientId}`)
    return records
  } catch (error) {
    console.error('Error al obtener historias por paciente:', error)
    return []
  }
}

export const updateMedicalRecord = async (userId, recordId, updatedData) => {
  try {
    const recordRef = doc(db, 'medicalRecords', userId, 'records', recordId)
    await updateDoc(recordRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    })
    console.log('Historia clínica actualizada:', recordId)
  } catch (error) {
    console.error('Error al actualizar historia clínica:', error)
    throw error
  }
}

export const deleteMedicalRecord = async (userId, recordId) => {
  try {
    const recordRef = doc(db, 'medicalRecords', userId, 'records', recordId)
    await deleteDoc(recordRef)
    console.log('Historia clínica eliminada:', recordId)
  } catch (error) {
    console.error('Error al eliminar historia clínica:', error)
    throw error
  }
}
