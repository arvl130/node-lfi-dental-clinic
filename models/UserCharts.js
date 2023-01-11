const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getDeciduous(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("deciduousChart")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      dataUrl: "",
    }
}

async function setDeciduous(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("deciduousChart")
    .set({
      dataUrl,
    })
}

async function getDental(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("dentalChart")
    .get()

  if (docSnap.exists) {
    const data = docSnap.data()
    if (data) return data.dataUrl
    else return ""
  } else return ""
}

async function setDental(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("dentalChart")
    .set({
      dataUrl,
    })
}

async function getMedical(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("medicalChart")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      personalInformation: {
        fullName: "",
        gender: "",
        birthDate: "",
        maritalStatus: "",
        mobileNo: "",
        telephoneNo: "",
      },
      medicalHistory: {
        heartAilmentDisease: "",
        hospitalAdmission: "",
        selfMedication: "",
        allergies: "",
        operation: "",
        tumors: "",
        diabetes: false,
        sinusitis: false,
        bleedingGums: false,
        hypertension: false,
        stomachDisease: false,
        bloodDisease: false,
        headache: false,
        liverDisease: false,
        cold: false,
        kidneyDisease: false,
        pregnant: "",
        familyHistory: "",
      },
      dentalHistory: {
        bleedingInMouth: false,
        gumsChangeColor: false,
        sensitiveTeeth: false,
        badBreath: false,
        palate: false,
        teethChangeColor: false,
        lumpsInMouth: false,
        clickingSoundInMouth: false,
        pastDentalCare: "",
      },
    }
}

async function setMedical(
  patientUid,
  personalInformation,
  medicalHistory,
  dentalHistory
) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("medicalChart")
    .set({
      personalInformation,
      medicalHistory,
      dentalHistory,
    })
}

async function isFilledInMedicalChart(patientUid) {
  const docSnap = await db.collection("users").doc(patientUid)

  if (docSnap.exists) {
    const data = docSnap.data()
    if (data.filledInMedicalChart) return true
    else return false
  } else return false
}

async function setFilledInMedicalChart(patientUid) {
  await db.collection("users").doc(patientUid).set(
    {
      filledInMedicalChart: true,
    },
    {
      merge: true,
    }
  )
}

module.exports = {
  getDeciduous,
  setDeciduous,
  getDental,
  setDental,
  getMedical,
  setMedical,
  isFilledInMedicalChart,
  setFilledInMedicalChart,
}
