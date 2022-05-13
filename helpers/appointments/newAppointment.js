const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const db = getFirestore();

module.exports = async (patientUid, slotSeconds, service) => {
  const monthSeconds = getMonthSecondsFromSlotSeconds(parseInt(slotSeconds));
  const batch = db.batch();
  const userAppointmentsRef = db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds.toString());

  const reservationsRef = db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString());

  batch.set(userAppointmentsRef, {
    createdAt: FieldValue.serverTimestamp(),
    service,
    procedure: "",
    price: 0,
    balance: 0,
    status: null,
    month: monthSeconds,
    patientUid,
    attended: false,
    procedureVisible: false,
  });

  batch.update(
    reservationsRef,
    {
      [slotSeconds]: {
        status: "taken",
      },
    },
    {
      merge: true,
    }
  );

  await batch.commit();
};
