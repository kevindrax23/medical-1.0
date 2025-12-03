import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const colors = {
  primary: [102, 126, 234],      // #667eea
  secondary: [118, 75, 162],      // #764ba2
  text: [45, 55, 72],             // #2d3748
  lightText: [113, 128, 150],      // #718096
  border: [226, 232, 240]         // #e2e8f0
}

export const generateMedicalRecordPDF = async (record) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  let yPosition = 10

  // 1. ENCABEZADO CON LOGO
  drawHeader(doc, record, yPosition)
  yPosition += 45

  // 2. INFORMACIÓN DEL PACIENTE
  drawPatientInfo(doc, record, yPosition)
  yPosition += 30

  // 3. DATOS CLÍNICOS
  yPosition = drawClinicalData(doc, record, yPosition)

  // 4. FIRMA DEL MÉDICO
  drawSignature(doc, record, yPosition)

  // Guardar PDF
  const fileName = `Historia_Clinica_${record.patientName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
  doc.save(fileName)
}

const drawHeader = (doc, record, yPosition) => {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Fondo de encabezado
  doc.setFillColor(...colors.primary)
  doc.rect(0, yPosition - 10, pageWidth, 40, 'F')

  // Logo/Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont(undefined, 'bold')
  doc.text('HISTORIA CLÍNICA', 15, yPosition + 5)

  // Información de la clínica
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text('Sistema de Gestión Médica MediSystem', 15, yPosition + 15)
  doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy', { locale: es })}`, 15, yPosition + 20)

  // Número de historia (lado derecho)
  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  const historyNumber = record.id?.substring(0, 8).toUpperCase() || 'N/A'
  doc.text(`# ${historyNumber}`, pageWidth - 40, yPosition + 12)
}

const drawPatientInfo = (doc, record, yPosition) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Caja de información del paciente
  doc.setDrawColor(...colors.border)
  doc.setLineWidth(0.5)
  doc.rect(15, yPosition, pageWidth - 30, 25)

  // Título de sección
  doc.setTextColor(...colors.primary)
  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.text('INFORMACIÓN DEL PACIENTE', 20, yPosition + 5)

  // Datos del paciente
  doc.setTextColor(...colors.text)
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')

  const patientData = record.patientData || {}
  const data = [
    `Nombre: ${record.patientName || 'N/A'}`,
    `Edad: ${calculateAge(patientData.birthDate) || 'N/A'} años`,
    `C.C./Cédula: ${patientData.idNumber || 'N/A'}`,
    `Teléfono: ${patientData.phone || 'N/A'}`,
    `Tipo de Sangre: ${patientData.bloodType || 'N/A'}`,
    `Género: ${patientData.gender || 'N/A'}`
  ]

  const col1X = 20
  const col2X = 80
  const col3X = 140

  doc.text(data[0], col1X, yPosition + 12)
  doc.text(data[1], col1X, yPosition + 17)
  doc.text(data[2], col2X, yPosition + 12)
  doc.text(data[3], col2X, yPosition + 17)
  doc.text(data[4], col3X, yPosition + 12)
  doc.text(data[5], col3X, yPosition + 17)
}

const drawClinicalData = (doc, record, yPosition) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  let currentY = yPosition

  // Función para dibujar una sección
  const drawSection = (title, content, yPos) => {
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Verificar si necesita nueva página
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }

    // Título de sección
    doc.setFillColor(243, 244, 246)
    doc.rect(15, yPos, pageWidth - 30, 7, 'F')
    
    doc.setTextColor(...colors.primary)
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(title, 20, yPos + 5)

    // Contenido
    doc.setTextColor(...colors.text)
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')

    const maxWidth = pageWidth - 40
    const lines = doc.splitTextToSize(content || 'N/A', maxWidth)
    doc.text(lines, 20, yPos + 14)

    return yPos + 14 + (lines.length * 5) + 8
  }

  // Signos Vitales
  let vitalsText = 'No registrados'
  if (record.vitals && Object.keys(record.vitals).some(k => record.vitals[k])) {
    vitalsText = [
      record.vitals.temperature ? `Temperatura: ${record.vitals.temperature}°C` : '',
      record.vitals.bloodPressure ? `Presión Arterial: ${record.vitals.bloodPressure} mmHg` : '',
      record.vitals.heartRate ? `Frecuencia Cardíaca: ${record.vitals.heartRate} bpm` : '',
      record.vitals.weight ? `Peso: ${record.vitals.weight} kg` : '',
      record.vitals.height ? `Altura: ${record.vitals.height} cm` : ''
    ].filter(v => v).join('  •  ')
  }
  currentY = drawSection('SIGNOS VITALES', vitalsText, currentY)

  // Motivo de Consulta
  currentY = drawSection(
    'MOTIVO DE CONSULTA / QUEJA PRINCIPAL',
    record.chiefComplaint || 'N/A',
    currentY
  )

  // Enfermedad Actual
  if (record.presentIllness) {
    currentY = drawSection(
      'ENFERMEDAD ACTUAL',
      record.presentIllness,
      currentY
    )
  }

  // Examen Físico
  if (record.physicalExam) {
    currentY = drawSection(
      'EXAMEN FÍSICO',
      record.physicalExam,
      currentY
    )
  }

  // Diagnóstico
  currentY = drawSection(
    'DIAGNÓSTICO CLÍNICO',
    record.diagnosis || 'N/A',
    currentY
  )

  // Plan de Tratamiento
  if (record.treatment) {
    currentY = drawSection(
      'PLAN DE TRATAMIENTO',
      record.treatment,
      currentY
    )
  }

  // Receta Médica
  if (record.prescription) {
    currentY = drawSection(
      'RECETA MÉDICA',
      record.prescription,
      currentY
    )
  }

  // Exámenes de Laboratorio
  if (record.labTests) {
    currentY = drawSection(
      'EXÁMENES DE LABORATORIO SOLICITADOS',
      record.labTests,
      currentY
    )
  }

  // Seguimiento
  if (record.followUpDate) {
    currentY = drawSection(
      'SEGUIMIENTO',
      `Próxima cita: ${format(new Date(record.followUpDate), 'dd/MM/yyyy', { locale: es })}`,
      currentY
    )
  }

  // Notas Adicionales
  if (record.notes) {
    currentY = drawSection(
      'NOTAS ADICIONALES',
      record.notes,
      currentY
    )
  }

  return currentY + 10
}

const drawSignature = (doc, record, yPosition) => {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Si está muy cerca del final, ir a nueva página
  if (yPosition > pageHeight - 50) {
    doc.addPage()
    yPosition = 20
  }

  // Línea de firma
  const signatureY = pageHeight - 60
  
  doc.setDrawColor(...colors.border)
  doc.setLineWidth(0.5)
  doc.line(30, signatureY, 100, signatureY)
  doc.line(130, signatureY, 200, signatureY)

  // Texto de firma
  doc.setFontSize(8)
  doc.setTextColor(...colors.lightText)
  doc.setFont(undefined, 'normal')
  doc.text('Firma del Médico', 40, signatureY + 8)
  doc.text('Sello/Timbre', 150, signatureY + 8)

  // Pie de página
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text(
    'Documento generado por MediSystem - Confidencial',
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  )
}

const calculateAge = (birthDate) => {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age > 0 ? age : null
}
