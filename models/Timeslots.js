const {
  getFirestore,
  FieldValue,
  FieldPath,
} = require("firebase-admin/firestore")
const getMonthSecondsFromSlotSeconds = require("../helpers/conversions/getMonthSecondsFromSlotSeconds")
const getUnixTimestampFromMonthAndYear = require("../helpers/conversions/getUnixTimestampFromMonthAndYear")
const db = getFirestore()

async function create(slotSeconds, status) {
  const monthSeconds = getMonthSecondsFromSlotSeconds(slotSeconds)
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
    )
}

async function remove(slotSeconds) {
  const monthSeconds = getMonthSecondsFromSlotSeconds(slotSeconds)
  await db
    .collection("monthlyReservations")
    .doc(monthSeconds.toString())
    .update({
      [slotSeconds]: FieldValue.delete(),
    })
}

async function update(slotSeconds, payload) {
  await db.collection("timeslots").doc(slotSeconds.toString()).set(payload, {
    merge: true,
  })
}

async function getClosed(year, month) {
  const unixTimestamp = getUnixTimestampFromMonthAndYear(year, month)

  const docSnap = await db
    .collection("monthlyReservations")
    .doc(unixTimestamp.toString())
    .get()

  const dates = []

  if (docSnap.exists) {
    const data = docSnap.data()
    Object.keys(data).forEach((timeslot) => {
      if (data[timeslot].status === "closed") dates.push(timeslot)
    })
  }

  return dates
}

async function getTaken(startSeconds, endSeconds) {
  // We pass seconds to this function, so make sure to
  // transform them into milliseconds.
  const colSnap = await db
    .collection("timeslots")
    .where(FieldPath.documentId(), ">=", startSeconds)
    .where(FieldPath.documentId(), "<", endSeconds)
    .where("status", "==", "taken")
    .get()

  const dates = []

  if (colSnap.empty) return dates

  colSnap.forEach((doc) => {
    dates.push(doc.id)
  })

  return dates
}

async function getUnavailable(year, month) {
  const unixTimestamp = getUnixTimestampFromMonthAndYear(year, month)

  const docSnap = await db
    .collection("monthlyReservations")
    .doc(unixTimestamp.toString())
    .get()

  const dates = []

  if (docSnap.exists) {
    const data = docSnap.data()
    Object.keys(data).forEach((timeslot) => {
      dates.push({
        timeslot,
        status: data[timeslot].status,
      })
    })
  }

  return dates
}

module.exports = {
  create,
  remove,
  update,
  getClosed,
  getUnavailable,
  getTaken,
}
