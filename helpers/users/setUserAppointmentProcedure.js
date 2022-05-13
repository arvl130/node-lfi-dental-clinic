const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
module.exports = async (patientUid, slotSeconds, procedureBody) => {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedure: procedureBody,
      },
      {
        merge: true,
      }
    );
};
