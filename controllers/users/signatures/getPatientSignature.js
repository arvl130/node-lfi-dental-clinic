const HttpError = require("../../../helpers/HttpError")
const { getPatientSignature } = require("../../../helpers/users/signatures")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const patientSignature = await getPatientSignature(patientUid)

    res.status(200).json({
      message: "Retrieved patient signature",
      payload: {
        uid: patientUid,
        ...patientSignature,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting patient signature: ${e.message}`,
    })
  }
}
