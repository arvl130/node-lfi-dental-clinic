const { getAuth } = require("firebase-admin/auth")
const auth = getAuth()
const HttpError = require("../../helpers/HttpError")
const updateMedicalChart = require("../../helpers/users/updateMedicalChart")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const personalInformation = req.body.personalInformation
    const medicalHistory = req.body.medicalHistory
    const dentalHistory = req.body.dentalHistory

    // TODO: validate fields and format of personalInformation,
    // medicalHistory, and dentalHistory

    if (!patientUid)
      throw new HttpError("Missing or invalid dental history", 400)

    if (!personalInformation)
      throw new HttpError("Missing or invalid personal information", 400)

    if (!medicalHistory)
      throw new HttpError("Missing or invalid medical history", 400)

    if (!dentalHistory)
      throw new HttpError("Missing or invalid dental history", 400)

    await auth.updateUser(patientUid, {
      displayName: personalInformation.fullName,
    })

    await updateMedicalChart(
      patientUid,
      personalInformation,
      medicalHistory,
      dentalHistory
    )

    res.status(200).json({
      message: "Updated medical chart",
      payload: {
        uid: patientUid,
        personalInformation,
        medicalHistory,
        dentalHistory,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating medical chart: ${e.message}`,
    })
  }
}
