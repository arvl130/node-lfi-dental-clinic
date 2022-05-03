const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (slotSeconds, payload) => {
  await db.collection("timeslots").doc(slotSeconds.toString()).set(payload, {
    merge: true,
  });
};
