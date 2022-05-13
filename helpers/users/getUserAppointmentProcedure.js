const { getFirestore } = require("firebase-admin/firestore");
const HttpError = require("../HttpError");

const db = getFirestore();
module.exports = async (patientUid, slotSeconds) => {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .get();

  if (!docSnap.exists) throw new HttpError("No such appointment", 400);

  const data = docSnap.data();
  return {
    uid: docSnap.id,
    procedure: data.procedure,
    procedureVisible: data.procedureVisible,
  };
};
