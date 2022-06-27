const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

module.exports = async (patientUid) => {
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
