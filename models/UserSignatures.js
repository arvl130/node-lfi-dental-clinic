const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getPatient(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("patientSignature")
    .get()

  if (docSnap.exists) {
    const data = docSnap.data()
    if (data && data.dataUrl) return data.dataUrl
    else return ""
  }
  return ""
}

async function setPatient(patientUid, dataUrl) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("patientSignature")
    .set({
      dataUrl,
    })
}

async function getGuardian(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("guardianSignature")
    .get()

  if (docSnap.exists) {
    const data = docSnap.data()
    if (data && data.dataUrl) return data.dataUrl
    else return ""
  }
  return ""
}

async function setGuardian(patientUid, dataUrl) {
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
  getPatient,
  setPatient,
  getGuardian,
  setGuardian,
}
