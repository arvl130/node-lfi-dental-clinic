const HttpError = require("../../../helpers/HttpError")
const { getMedicalChart } = require("../../../helpers/users/charts")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const medicalChart = await getMedicalChart(patientUid)

    res.status(200).json({
      message: "Retrieved medical chart",
      payload: {
        uid: patientUid,
        ...medicalChart,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting medical chart: ${e.message}`,
    })
  }
}
