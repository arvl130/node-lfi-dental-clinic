const { getFirestore, FieldValue } = require("firebase-admin/firestore")
const db = getFirestore()

async function remove(uid) {
  const doc = await db.collection("messages").doc(uid).get()

  if (!doc.exists) {
    const error = new Error("No such document")
    error.httpErrorCode = 404
    throw error
  }

  await db.collection("messages").doc(uid).delete()

  return {
    uid: doc.id,
    ...doc.data(),
  }
}

async function getAll() {
  const snapshot = await db
    .collection("messages")
    .orderBy("createdAt", "desc")
    .get()

  const messages = []

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      messages.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
  }

  return messages
}

async function create(partialMessage) {
  const doc = await db.collection("messages").add({
    ...partialMessage,
    isArchived: false,
    createdAt: FieldValue.serverTimestamp(),
  })

  const docSnap = await doc.get()
  if (!docSnap.exists) {
    const error = new Error("Could not retrieve created message")
    error.httpErrorCode = 500
    throw error
  }

  return {
    uid: doc.id,
    ...docSnap.data(),
  }
}

async function toggleArchiveStatus(uid) {
  const docSnap = await db.collection("messages").doc(uid).get()

  if (!docSnap.exists) {
    const error = new Error("No such message")
    error.httpErrorCode = 404
    throw error
  }

  const { isArchived } = docSnap.data()

  await db.collection("messages").doc(uid).set(
    {
      isArchived: !isArchived,
    },
    {
      merge: true,
    }
  )

  return {
    newStatus: isArchived ? "archived" : "unarchived",
  }
}

module.exports = {
  create,
  remove,
  getAll,
  toggleArchiveStatus,
}
