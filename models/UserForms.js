const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getConsent(patientUid) {
  const docSnap = db
    .collection("users")
    .doc(`${patientUid}/patientRecords/consentForm`)
    .get()

  if (docSnap.exists) return docSnap.data()
  else return {}
}

async function setConsent(patientUid, consentForm) {
  await db
    .collection("users")
    .doc(`${patientUid}/patientRecords/consentForm`)
    .set(docRef, consentForm, {
      merge: true,
    })
}

async function getAssessment(patientUid) {
  const docSnap = await db
    .collection("users")
    .doc(`${patientUid}/patientRecords/assessmentForm`)
    .get()

  if (docSnap.exists) return docSnap.data()
  else return {}
}

async function setAssessment(patientUid, assessmentForm) {
  await db
    .collection("users")
    .doc(`${patientUid}/patientRecords/assessmentForm`)
    .set(docRef, assessmentForm, {
      merge: true,
    })
}

module.exports = {
  getConsent,
  setConsent,
  getAssessment,
  setAssessment,
}
