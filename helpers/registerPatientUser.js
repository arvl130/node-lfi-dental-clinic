const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();
const HttpError = require("./HttpError");

module.exports = async (email, password, fullName) => {
  const userRecord = await auth.createUser({
    displayName: fullName,
    email,
    password,
  });

  const uid = userRecord.uid;

  await auth.setCustomUserClaims(uid, {
    accountType: "patient",
  });

  await db.collection("users").doc(uid).set({
    accountType: "patient",
  });

  const docSnap = await db.collection("users").doc(uid).get();

  if (!docSnap.exists) {
    throw new HttpError("Could not retrieve created user");
  }

  return {
    uid,
    ...docSnap.data(),
  };
};