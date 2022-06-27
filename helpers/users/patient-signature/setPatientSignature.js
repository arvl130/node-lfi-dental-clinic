const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

module.exports = async (patientUid, dataUrl) => {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("patientSignature")
    .set({
      dataUrl,
    })
}
