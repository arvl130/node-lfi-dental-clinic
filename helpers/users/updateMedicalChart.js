const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
module.exports = async (
  patientUid,
  personalInformation,
  medicalHistory,
  dentalHistory
) => {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("medicalChart")
    .set({
      personalInformation,
      medicalHistory,
      dentalHistory,
    });
};
