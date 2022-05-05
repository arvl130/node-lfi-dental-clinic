const { getFirestore } = require("firebase-admin/firestore");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const db = getFirestore();

module.exports = async (slotSeconds, status) => {
  const monthSeconds = getMonthSecondsFromSlotSeconds(slotSeconds);
  await db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())
    .set(
      {
        [slotSeconds]: {
          status,
        },
      },
      {
        merge: true,
      }
    );
};
