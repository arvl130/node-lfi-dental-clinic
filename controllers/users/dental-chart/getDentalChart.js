const getDentalChart = require("../../../helpers/users/dental-chart/getDentalChart")
const HttpError = require("../../../helpers/HttpError")
const { getAuth } = require("firebase-admin/auth")
const auth = getAuth()

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const dentalChart = await getDentalChart(patientUid)

    res.status(200).json({
      message: "Retrieved dental chart",
      payload: {
        uid: patientUid,
        ...dentalChart,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting dental chart: ${e.message}`,
    })
  }
}
