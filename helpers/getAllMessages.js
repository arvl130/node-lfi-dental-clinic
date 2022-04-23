const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async () => {
  const snapshot = await db
    .collection("messages")
    .orderBy("createdAt", "desc")
    .get();

  const messages = [];

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      messages.push({
        uid: doc.id,
        ...doc.data(),
      });
    });
  }

  return messages;
};
