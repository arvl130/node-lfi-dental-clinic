const { getFirestore, FieldValue } = require("firebase-admin/firestore")
const { getAuth } = require("firebase-admin/auth")
const getMonthSecondsFromSlotSeconds = require("../helpers/conversions/getMonthSecondsFromSlotSeconds")
const getUnixTimestampFromMonthAndYear = require("../helpers/conversions/getUnixTimestampFromMonthAndYear")
const sendEmail = require("../helpers/sendEmail")
const HttpError = require("../helpers/HttpError")

const db = getFirestore()
const auth = getAuth()

async function cancel(patientUid, slotSeconds) {
  const monthSeconds = getMonthSecondsFromSlotSeconds(parseInt(slotSeconds))
  const userAppointmentRef = db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds.toString())

  const reservationRef = db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())

  const userAppointmentSnapshot = await userAppointmentRef.get()
  if (!userAppointmentSnapshot.exists)
    throw new HttpError(`No such appointment`, 400)

  const reservationSnapshot = await reservationRef.get()
  if (!reservationSnapshot.exists)
    throw new HttpError(`No such reservation`, 400)

  const reservationData = reservationSnapshot.data()
  if (!reservationData.hasOwnProperty(slotSeconds.toString()))
    throw new HttpError(`No such reservation`, 400)

  const batch = db.batch()
  batch.delete(userAppointmentRef)

  batch.update(reservationRef, {
    [slotSeconds]: FieldValue.delete(),
  })

  await batch.commit()

  const userRecord = await auth.getUser(patientUid)
  const patientName = userRecord.displayName
  const email = userRecord.email
  const formattedDate = new Date(slotSeconds * 1000).toLocaleString("en-us", {
    timeZone: "Asia/Manila",
    month: "long",
    year: "numeric",
    day: "numeric",
  })
  const hours = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[0]
  const minutes = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[1]
  const ampm = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[2]
  await sendEmail(
    email,
    "LFI Dental Clinic - Your appointment has been cancelled",
    `
Dear ${patientName},

The following appointment you have set has been cancelled:
Date and time: ${formattedDate} ${hours}:${minutes} ${ampm}
Service: ${userAppointmentSnapshot.data().service ?? "N/A"}

This is a system-generated email notification. Replies to this message are not monitored or answered.
  `
  )
}

async function create(patientUid, slotSeconds, service) {
  const monthSeconds = getMonthSecondsFromSlotSeconds(parseInt(slotSeconds))
  const batch = db.batch()
  const userAppointmentsRef = db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds.toString())

  const reservationsRef = db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())

  batch.set(userAppointmentsRef, {
    createdAt: FieldValue.serverTimestamp(),
    timeslot: slotSeconds.toString(),
    service,
    procedure: "",
    price: 0,
    amountPaid: 0,
    status: null,
    month: monthSeconds,
    patientUid,
    attended: "pending",
    procedureVisible: false,
  })

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
  )

  await batch.commit()

  const userRecord = await auth.getUser(patientUid)
  const patientName = userRecord.displayName
  const email = userRecord.email
  const formattedDate = new Date(slotSeconds * 1000).toLocaleString("en-us", {
    timeZone: "Asia/Manila",
    month: "long",
    year: "numeric",
    day: "numeric",
  })
  const hours = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[0]
  const minutes = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[1]
    .split(":")[1]
  const ampm = new Date(slotSeconds * 1000)
    .toLocaleString("en-us", {
      timeZone: "Asia/Manila",
    })
    .split(" ")[2]
  await sendEmail(
    email,
    "LFI Dental Clinic - You have been reserved an appointment",
    `
Dear ${patientName},

The following appointment has been reserved for you:
Date and time: ${formattedDate} ${hours}:${minutes} ${ampm}
Service: ${service}

This is a system-generated email notification. Replies to this message are not monitored or answered.
  `
  )
}

async function getAll(year, month) {
  const unixTimestamp = getUnixTimestampFromMonthAndYear(year, month)

  const colSnap = await db
    .collectionGroup("appointments")
    .where("month", "==", unixTimestamp)
    .get()

  const appointments = []

  if (!colSnap.empty) {
    colSnap.forEach((doc) => {
      appointments.push({
        timeslot: doc.id,
        ...doc.data(),
      })
    })
  }

  return appointments
}

async function silentDelete(patientUid, slotSeconds) {
  const monthSeconds = getMonthSecondsFromSlotSeconds(parseInt(slotSeconds))
  const userAppointmentRef = db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds.toString())

  const reservationRef = db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())

  const userAppointmentSnapshot = await userAppointmentRef.get()
  if (!userAppointmentSnapshot.exists)
    throw new HttpError(`No such appointment`, 400)

  const reservationSnapshot = await reservationRef.get()
  if (!reservationSnapshot.exists)
    throw new HttpError(`No such reservation`, 400)

  const reservationData = reservationSnapshot.data()
  if (!reservationData.hasOwnProperty(slotSeconds.toString()))
    throw new HttpError(`No such reservation`, 400)

  const batch = db.batch()
  batch.delete(userAppointmentRef)

  batch.update(reservationRef, {
    [slotSeconds]: FieldValue.delete(),
  })

  await batch.commit()
}

module.exports = {
  getAll,
  create,
  cancel,
  silentDelete,
}
