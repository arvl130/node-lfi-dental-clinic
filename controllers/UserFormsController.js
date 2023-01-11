const HttpError = require("../helpers/HttpError")
const {
  getAssessment: doGetAssesment,
  setAssessment: doSetAssessment,
  getConsent: doGetConsent,
  setConsent: doSetConsent,
} = require("../models/UserForms")

async function getAssessment(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const assessmentForm = await doGetAssesment(patientUid)

    res.status(200).json({
      message: "Retrieved assessment form",
      payload: assessmentForm,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting assessment form: ${e.message}`,
    })
  }
}

async function getConsent(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const consentForm = await doGetConsent(patientUid)

    res.status(200).json({
      message: "Retrieved consent form",
      payload: consentForm,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting consent form: ${e.message}`,
    })
  }
}
async function setAssessment(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetAssessment(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated assessment form",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating assessment form: ${e.message}`,
    })
  }
}

async function setConsent(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetConsent(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated consent form",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating consent form: ${e.message}`,
    })
  }
}

module.exports = {
  getAssessment,
  setAssessment,
  getConsent,
  setConsent,
}
