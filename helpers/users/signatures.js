const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getPatientSignature(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("patientSignature")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      dataUrl: "",
    }
}

async function setPatientSignature(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("patientSignature")
    .set({
      dataUrl,
    })
}

async function getGuardianSignature(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("guardianSignature")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      dataUrl: "",
    }
}

async function setGuardianSignature(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("guardianSignature")
    .set({
      dataUrl,
    })
}

module.exports = {
  getPatientSignature,
  setPatientSignature,
  getGuardianSignature,
  setGuardianSignature,
}
