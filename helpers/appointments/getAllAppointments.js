const {
  getFirestore,
  FieldValue,
  FieldPath,
} = require("firebase-admin/firestore");
const getUnixTimestampFromMonthAndYear = require("../conversions/getUnixTimestampFromMonthAndYear");

const db = getFirestore();

module.exports = async (year, month) => {
  const unixTimestamp = getUnixTimestampFromMonthAndYear(year, month);

  const colSnap = await db
    .collectionGroup("appointments")
    .where("month", "==", unixTimestamp)
    .get();

  const appointments = [];

  if (!colSnap.empty) {
    colSnap.forEach((doc) => {
      appointments.push({
        timeslot: doc.id,
        ...doc.data(),
      });
    });
  }

  return appointments;
};
