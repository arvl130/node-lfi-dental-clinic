const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const getMonthSecondsFromSlotSeconds = require("../conversions/getMonthSecondsFromSlotSeconds");
const sendEmail = require("./sendEmail");
const db = getFirestore();
const auth = getAuth();

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
    "LFI Dental Clinic - You have been reserved an appointment",
    `
The following appointment has been reserved:
Date and time: ${formattedDate} ${hours}:${minutes} ${ampm}
Patient name: ${patientName}
Service: ${service}
  `
  );
};
