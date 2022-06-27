const HttpError = require("../../../helpers/HttpError")
const { setPatientSignature } = require("../../../helpers/users/signatures")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await setPatientSignature(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated patient signature",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating patient signature: ${e.message}`,
    })
  }
}
