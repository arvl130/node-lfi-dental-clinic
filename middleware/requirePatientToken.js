const { getAuth } = require("firebase-admin/auth");
const HttpError = require("../helpers/HttpError");

const auth = getAuth();

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader)
      throw new HttpError("Missing or invalid authorization header", 400);

    const idToken = authorizationHeader.split(" ")[1];

    if (!idToken) throw new HttpError("Missing or invalid ID token", 400);

    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken.accountType !== "patient")
      throw new HttpError("Unauthorized request", 401);

    req.patientUid = decodedToken.uid;

    next();
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting available slots: ${e.message}`,
    });
  }
};
