const {
  getFirestore,
  Timestamp,
  FieldPath,
} = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (startSeconds, endSeconds) => {
  // We pass seconds to this function, so make sure to
  // transform them into milliseconds.
  const colSnap = await db
    .collection("closed_dates")
    .where(FieldPath.documentId(), ">=", startSeconds)
    .where(FieldPath.documentId(), "<", endSeconds)
    .get();

  const dates = [];

  if (colSnap.empty) return dates;

  colSnap.forEach((doc) => {
    dates.push(doc.id);
  });

  return dates;
};
