const HttpError = require("../../helpers/HttpError");
const getUserProfile = require("../../helpers/users/getUserProfile");

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid;

    if (!patientUid)
      throw new HttpError("Missing or invalid dental history", 400);

    const userRecord = await getUserProfile(patientUid);

    res.status(200).json({
      message: "User profile retrieved",
      payload: {
        uid: patientUid,
        userRecord,
      },
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user profile: ${e.message}`,
    });
  }
};
