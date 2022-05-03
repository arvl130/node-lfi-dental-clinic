const { getFirestore, FieldPath } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (startSeconds, endSeconds) => {
  // We pass seconds to this function, so make sure to
  // transform them into milliseconds.
  const colSnap = await db
    .collection("timeslots")
    .where(FieldPath.documentId(), ">=", startSeconds)
    .where(FieldPath.documentId(), "<", endSeconds)
    .where("status", "==", "taken")
    .get();

  const dates = [];

  if (colSnap.empty) return dates;

  colSnap.forEach((doc) => {
    dates.push(doc.id);
  });

  return dates;
};
