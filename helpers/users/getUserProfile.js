const { getAuth } = require("firebase-admin/auth");

const auth = getAuth();
module.exports = async (patientUid) => {
  return await auth.getUser(patientUid);
};
