const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const HttpError = require("../HttpError");
const sendEmail = require("./sendEmail");
const db = getFirestore();
const auth = getAuth();

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

  const userRecord = await auth.getUser(patientUid);
  const patientName = userRecord.displayName;
  const email = userRecord.email;
  const formattedDate = new Date(slotSeconds * 1000).toLocaleString("en-us", {
    timeZone: "Asia/Manila",
    month: "long",
    year: "numeric",
    day: "numeric",
  });
  const hours = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[0];
  const minutes = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[1];
  const ampm = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[2];
  await sendEmail(
    email,
    "LFI Dental Clinic - Your appointment has been cancelled",
    `
The following appointment has been cancelled:
Date and time: ${formattedDate} ${hours}:${minutes} ${ampm}
Patient name: ${patientName}
Service: ${userAppointmentSnapshot.data().service ?? "N/A"}
  `
  );
};
