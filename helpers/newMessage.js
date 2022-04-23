const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (partialMessage) => {
  const doc = await db.collection("messages").add({
    ...partialMessage,
    createdAt: FieldValue.serverTimestamp(),
  });

  const docSnap = await doc.get();
  if (!docSnap.exists) {
    const error = new Error("Could not retrieve created message");
    error.httpErrorCode = 500;
    throw error;
  }

  return {
    uid: doc.id,
    ...docSnap.data(),
  };
};
