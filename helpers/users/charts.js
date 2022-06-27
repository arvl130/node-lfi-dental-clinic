const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getDeciduousChart(patientUid) {
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

async function setDeciduousChart(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("deciduousChart")
    .set({
      dataUrl,
    })
}

async function getDentalChart(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("dentalChart")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      dataUrl: "",
    }
}

async function setDentalChart(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("dentalChart")
    .set({
      dataUrl,
    })
}

async function getMedicalChart(patientUid) {
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

async function setMedicalChart(
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

module.exports = {
  getDeciduousChart,
  setDeciduousChart,
  getDentalChart,
  setDentalChart,
  getMedicalChart,
  setMedicalChart,
}
