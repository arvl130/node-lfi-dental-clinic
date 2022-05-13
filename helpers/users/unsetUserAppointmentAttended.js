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
        attended: false,
        price: 0,
        balance: 0,
        status: null,
        procedure: "",
        procedureVisible: false,
      },
      {
        merge: true,
      }
    );
};
