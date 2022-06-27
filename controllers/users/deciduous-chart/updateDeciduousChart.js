const HttpError = require("../../../helpers/HttpError")
const updateDeciduousChart = require("../../../helpers/users/deciduous-chart/updateDeciduousChart")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await updateDeciduousChart(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated deciduous chart",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating deciduous chart: ${e.message}`,
    })
  }
}
