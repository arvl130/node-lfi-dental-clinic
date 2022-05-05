const { getFirestore } = require("firebase-admin/firestore");
const getUnixTimestampFromMonthAndYear = require("../../helpers/conversions/getUnixTimestampFromMonthAndYear");

const db = getFirestore();

module.exports = async (year, month) => {
  const unixTimestamp = getUnixTimestampFromMonthAndYear(year, month);

  const docSnap = await db
    .collection("monthlyReservations")
    .doc(unixTimestamp.toString())
    .get();

  const dates = [];

  if (docSnap.exists) {
    const data = docSnap.data();
    Object.keys(data).forEach((timeslot) => {
      dates.push({
        timeslot,
        status: data[timeslot].status,
      });
    });
  }

  return dates;
};
