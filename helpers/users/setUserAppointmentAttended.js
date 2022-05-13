const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
module.exports = async (patientUid, slotSeconds) => {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        attended: true,
      },
      {
        merge: true,
      }
    );
};
