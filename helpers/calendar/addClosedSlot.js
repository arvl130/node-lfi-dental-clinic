const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (slotSeconds) => {
  await db.collection("closed_dates").doc(slotSeconds.toString()).set({});
};
