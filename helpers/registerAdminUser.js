const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();
const HttpError = require("../helpers/HttpError");

module.exports = async (username, password) => {
  const userRecord = await auth.createUser({
    displayName: "Admin User",
    password,
  });

  const uid = userRecord.uid;

  await auth.setCustomUserClaims({
    accountType: "admin",
  });

  await db.collection("users").doc(uid).set({
    username,
    accountType: "admin",
  });

  const docSnap = db.collection("users").doc(uid).get();
  if (!docSnap.exists) {
    throw new HttpError("Could not retrieve created user");
  }

  return {
    uid,
    ...docSnap.data(),
  };
};