const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const db = getFirestore();

module.exports = async (slotSeconds) => {
  const monthSeconds = getMonthSecondsFromSlotSeconds(slotSeconds);
  await db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())
    .update({
      [slotSeconds]: FieldValue.delete(),
    });
};
