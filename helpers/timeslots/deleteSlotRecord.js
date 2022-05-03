const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (slotSeconds) => {
  await db.collection("timeslots").doc(slotSeconds.toString()).delete();
};
