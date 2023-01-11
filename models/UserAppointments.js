const HttpError = require("../helpers/HttpError")
const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

async function getProcedure(patientUid, slotSeconds) {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .get()

  if (!docSnap.exists) throw new HttpError("No such appointment", 400)

  const data = docSnap.data()
  return {
    uid: docSnap.id,
    procedure: data.procedure,
    procedureVisible: data.procedureVisible,
  }
}

async function getAll(patientUid) {
  const colSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .get()

  const appointments = []

  if (colSnap.empty) return appointments

  colSnap.forEach((doc) => {
    appointments.push({
      uid: doc.id,
      ...doc.data(),
    })
  })

  return appointments
}

async function setAttended(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        attended: true,
      },
      {
        merge: true,
      }
    )
}

async function setNotAttended(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        attended: false,
      },
      {
        merge: true,
      }
    )
}

async function setPending(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        attended: "pending",
        price: 0,
        amountPaid: 0,
        status: null,
        procedure: "",
        procedureVisible: false,
      },
      {
        merge: true,
      }
    )
}

async function setProcedure(patientUid, slotSeconds, procedureBody) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedure: procedureBody,
      },
      {
        merge: true,
      }
    )
}

async function requestProcedureAccess(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedureVisible: "requesting",
      },
      {
        merge: true,
      }
    )
}

async function cancelRequestProcedureAccess(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedureVisible: false,
      },
      {
        merge: true,
      }
    )
}

async function setProcedureAccessAllowed(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedureVisible: true,
      },
      {
        merge: true,
      }
    )
}

async function setProcedureAccessDisallowed(patientUid, slotSeconds) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        procedureVisible: false,
      },
      {
        merge: true,
      }
    )
}

async function setAppointmentPayment(
  patientUid,
  slotSeconds,
  price,
  amountPaid,
  status
) {
  await db
    .collection("users")
    .doc(patientUid)
    .collection("appointments")
    .doc(slotSeconds)
    .set(
      {
        price,
        amountPaid,
        status,
      },
      {
        merge: true,
      }
    )
}

module.exports = {
  getAll,
  getProcedure,
  setProcedure,
  setAttended,
  setNotAttended,
  setPending,
  requestProcedureAccess,
  cancelRequestProcedureAccess,
  setProcedureAccessAllowed,
  setProcedureAccessDisallowed,
  setAppointmentPayment,
}
