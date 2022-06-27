const { getAuth } = require("firebase-admin/auth")
const HttpError = require("../helpers/HttpError")
const isDevelopmentEnvironment = require("../helpers/check-environment/isDevelopmentEnvironment")

const auth = getAuth()

module.exports = async (req, res, next) => {
  try {
    if (isDevelopmentEnvironment()) {
      next()
      return
    }

    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader)
      throw new HttpError("Missing or invalid authorization header", 400)

    const idToken = authorizationHeader.split(" ")[1]

    if (!idToken) throw new HttpError("Missing or invalid ID token", 400)

    const decodedToken = await auth.verifyIdToken(idToken)

    if (
      decodedToken.accountType === "patient" ||
      decodedToken.accountType === "admin"
    ) {
      req.patientUid = decodedToken.uid
      next()
    } else {
      throw new HttpError("Unauthorized request", 401)
    }
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting verifying token: ${e.message}`,
    })
  }
}
