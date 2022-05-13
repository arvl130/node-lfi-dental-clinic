const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
module.exports = async (patientUid) => {
  const colSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .get();

  const appointments = [];

  if (colSnap.empty) return appointments;

  colSnap.forEach((doc) => {
    appointments.push({
      uid: doc.id,
      ...doc.data(),
    });
  });

  return appointments;
};
