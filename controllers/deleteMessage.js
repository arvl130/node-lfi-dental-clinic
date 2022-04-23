const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (uid) => {
  const doc = await db.collection("messages").doc(uid).get();

  if (!doc.exists) {
    const error = new Error("No such document");
    error.httpErrorCode = 404;
    throw error;
  }

  await db.collection("messages").doc(uid).delete();

  return {
    uid: doc.id,
    ...doc.data(),
  };
};
