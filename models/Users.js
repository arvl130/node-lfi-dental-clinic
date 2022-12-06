const HttpError = require("../helpers/HttpError")
const { getFirestore } = require("firebase-admin/firestore")
const { getAuth } = require("firebase-admin/auth")
const db = getFirestore()
const auth = getAuth()

async function createAdmin(email, password) {
  const userRecord = await auth.createUser({
    displayName: "Admin User",
    email,
    password,
  })

  const uid = userRecord.uid

  await auth.setCustomUserClaims(uid, {
    accountType: "admin",
  })

  await db.collection("users").doc(uid).set({
    accountType: "admin",
    displayName: "Admin User",
    email,
  })

  const docSnap = await db.collection("users").doc(uid).get()

  if (!docSnap.exists) {
    throw new HttpError("Could not retrieve created user")
  }

  return {
    uid,
    ...docSnap.data(),
  }
}

async function createPatient(email, password, fullName) {
  try {
    const userRecord = await auth.createUser({
      displayName: fullName,
      email,
      password,
    })
    const uid = userRecord.uid

    await auth.setCustomUserClaims(uid, {
      accountType: "patient",
    })

    await db.collection("users").doc(uid).set({
      accountType: "patient",
      displayName: fullName,
      email,
      filledInMedicalChart: false,
      isArchived: false,
    })

    const docSnap = await db.collection("users").doc(uid).get()

    if (!docSnap.exists) {
      throw new HttpError("Could not retrieve created user")
    }

    return {
      uid,
      ...docSnap.data(),
    }
  } catch (e) {
    switch (e.code) {
      case "auth/email-already-exists":
        throw new HttpError("Email already exists", 400)
    }
  }
}

async function getFirstN(numberOfUsers, startAt = null) {
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

let usersList

async function getAllUsers(nextPageToken) {
  const usersListResult = await auth.listUsers(1000, nextPageToken)
  usersListResult.users.forEach((userRecord) => {
    usersList.push(userRecord.toJSON())
  })

  if (usersListResult.pageToken) {
    await getAllUsers(usersListResult.pageToken)
  }
}

async function getAll() {
  usersList = []
  await getAllUsers()
  return usersList
}

async function get(patientUid) {
  return await auth.getUser(patientUid)
}

async function getAnyN(numberOfUsers) {
  const usersList = []
  const usersRef = db
    .collection("users")
    .where("accountType", "==", "patient")
    .where("isArchived", "==", false)
    .limit(numberOfUsers)

  const usersSnapshot = await usersRef.get()
  if (!usersSnapshot.empty) {
    usersSnapshot.forEach((doc) => {
      usersList.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
  }

  return usersList
}

async function getArchivedAnyN(numberOfUsers) {
  const usersList = []
  const usersRef = db
    .collection("users")
    .where("accountType", "==", "patient")
    .where("isArchived", "==", true)
    .limit(numberOfUsers)

  const usersSnapshot = await usersRef.get()
  if (!usersSnapshot.empty) {
    usersSnapshot.forEach((doc) => {
      usersList.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
  }

  return usersList
}

async function getByName(nameFilter) {
  const usersList = []
  const usersRef = db
    .collection("users")
    .where("accountType", "==", "patient")
    .where("isArchived", "==", false)

  const usersSnapshot = await usersRef.get()
  if (!usersSnapshot.empty) {
    usersSnapshot.forEach((doc) => {
      usersList.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
  }

  return usersList.filter(({ displayName }) =>
    displayName.toLowerCase().includes(nameFilter)
  )
}

async function getArchivedByName(nameFilter) {
  const usersList = []
  const usersRef = db
    .collection("users")
    .where("accountType", "==", "patient")
    .where("isArchived", "==", true)

  const usersSnapshot = await usersRef.get()
  if (!usersSnapshot.empty) {
    usersSnapshot.forEach((doc) => {
      usersList.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
  }

  return usersList.filter(({ displayName }) =>
    displayName.toLowerCase().includes(nameFilter)
  )
}

async function setArchived(patientUid) {
  await db.collection("users").doc(`${patientUid}`).set(
    {
      isArchived: true,
    },
    {
      merge: true,
    }
  )
}

async function setNotArchived(patientUid) {
  await db.collection("users").doc(`${patientUid}`).set(
    {
      isArchived: false,
    },
    {
      merge: true,
    }
  )
}

module.exports = {
  createAdmin,
  createPatient,
  getFirstN,
  getAnyN,
  getArchivedAnyN,
  getAll,
  get,
  getByName,
  getArchivedByName,
  setArchived,
  setNotArchived,
}
