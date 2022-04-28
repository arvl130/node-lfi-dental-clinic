const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (startSeconds, endSeconds) => {
  // We pass seconds to this function, so make sure to
  // transform them into milliseconds.
  const startTime = Timestamp.fromMillis(startSeconds * 1000);
  const endTime = Timestamp.fromMillis(endSeconds * 1000);
  const colSnap = await db
    .collection("closed_dates")
    .where("date", ">=", startTime)
    .where("date", "<", endTime)
    .get();

  const dates = [];

  if (colSnap.empty) return dates;

  colSnap.forEach((doc) => {
    const data = doc.data();
    dates.push(data.date.seconds);
  });

  return dates;
};
