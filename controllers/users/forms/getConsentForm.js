const HttpError = require("../../../helpers/HttpError")
const { getConsentForm } = require("../../../helpers/users/forms")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const consentForm = await getConsentForm(patientUid)

    res.status(200).json({
      message: "Retrieved consent form",
      payload: {
        uid: patientUid,
        ...consentForm,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting consent form: ${e.message}`,
    })
  }
}
