const getDeciduousChart = require("../../../helpers/users/deciduous-chart/getDeciduousChart")
const HttpError = require("../../../helpers/HttpError")

module.exports = async (req, res) => {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const deciduousChart = await getDeciduousChart(patientUid)

    res.status(200).json({
      message: "Updated deciduous chart",
      payload: {
        uid: patientUid,
        ...deciduousChart,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting deciduous chart: ${e.message}`,
    })
  }
}
