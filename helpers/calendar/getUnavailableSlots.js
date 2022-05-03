const { getFirestore, FieldPath } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (startSeconds, endSeconds) => {
  // We pass seconds to this function, so make sure to
  // transform them into milliseconds.
  const colSnap = await db
    .collection("timeslots")
    .where(FieldPath.documentId(), ">=", startSeconds)
    .where(FieldPath.documentId(), "<", endSeconds)
    .where("status", "in", ["closed", "taken"])
    .get();

  const dates = [];

  if (colSnap.empty) return dates;

  colSnap.forEach((doc) => {
    const data = doc.data();
    dates.push({
      timeslot: doc.id,
      status: data.status,
    });
  });

  return dates;
};
