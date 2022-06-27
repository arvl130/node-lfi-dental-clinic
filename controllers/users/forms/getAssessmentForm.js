const HttpError = require("../../../helpers/HttpError")
const { getAssessmentForm } = require("../../../helpers/users/forms")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const assessmentForm = await getAssessmentForm(patientUid)

    res.status(200).json({
      message: "Retrieved assessment form",
      payload: {
        uid: patientUid,
        ...assessmentForm,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting assessment form: ${e.message}`,
    })
  }
}
