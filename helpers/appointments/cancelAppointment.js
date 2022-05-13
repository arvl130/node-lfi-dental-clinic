const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const HttpError = require("../HttpError");
const db = getFirestore();

module.exports = async (patientUid, slotSeconds) => {
  const monthSeconds = getMonthSecondsFromSlotSeconds(parseInt(slotSeconds));
  const userAppointmentRef = db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds.toString());

  const reservationRef = db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString());

  const userAppointmentSnapshot = await userAppointmentRef.get();
  if (!userAppointmentSnapshot.exists)
    throw new HttpError(`No such appointment`, 400);

  const reservationSnapshot = await reservationRef.get();
  if (!reservationSnapshot.exists)
    throw new HttpError(`No such reservation`, 400);

  const reservationData = reservationSnapshot.data();
  if (!reservationData.hasOwnProperty(slotSeconds.toString()))
    throw new HttpError(`No such reservation`, 400);

  const batch = db.batch();
  batch.delete(userAppointmentRef);

  batch.update(reservationRef, {
    [slotSeconds]: FieldValue.delete(),
  });

  await batch.commit();
};
