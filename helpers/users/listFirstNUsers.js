const { getFirestore } = require("firebase-admin/firestore")
const { getAuth } = require("firebase-admin/auth")

const auth = getAuth()
const db = getFirestore()

module.exports = async (numberOfUsers, startAt = null) => {
  const usersList = []

  const usersSnapshot =
    startAt !== null
      ? await db
          .collection("users")
          .where("accountType", "==", "patient")
          .orderBy("displayName")
          .startAt(await db.collection("users").doc(startAt).get())
          .limit(numberOfUsers)
          .get()
      : await db
          .collection("users")
          .where("accountType", "==", "patient")
          .orderBy("displayName")
          .limit(numberOfUsers)
          .get()

  if (usersSnapshot.empty) return usersList

  usersSnapshot.forEach((docSnap) => {
    const uid = docSnap.id

    // Push promises (instead of results) inside the array,
    // because return statements don't wait for async ForEach
    // functions to finish before returning.
    usersList.push(auth.getUser(uid))
  })

  return await Promise.all(usersList)
}
