const { getFirestore } = require("firebase-admin/firestore");
const { HttpError } = require("../../HttpError");
const db = getFirestore();

module.exports = async (patientUid) => {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("medicalChart")
    .get();

  if (!docSnap.exists) throw new HttpError("No such document", 404);

  return docSnap.data();
};
