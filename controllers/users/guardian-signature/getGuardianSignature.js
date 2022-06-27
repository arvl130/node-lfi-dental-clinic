const getGuardianSignature = require("../../../helpers/users/guardian-signature/getGuardianSignature")
const HttpError = require("../../../helpers/HttpError")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const guardianSignature = await getGuardianSignature(patientUid)

    res.status(200).json({
      message: "Retrieved guardian signature",
      payload: {
        uid: patientUid,
        ...guardianSignature,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting guardian signature: ${e.message}`,
    })
  }
}
