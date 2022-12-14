const HttpError = require("../helpers/HttpError")
const {
  getDeciduous: doGetDeciduous,
  getDental: doGetDental,
  getMedical: doGetMedical,
  setDeciduous: doSetDeciduous,
  setDental: doSetDental,
  setMedical: doSetMedical,
  isFilledInMedicalChart: doIsFilledInMedicalChart,
  setFilledInMedicalChart: doSetFilledInMedicalChart,
} = require("../models/UserCharts")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore } = require("firebase-admin/firestore")
const auth = getAuth()
const db = getFirestore()

async function getDeciduous(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const deciduousChart = await doGetDeciduous(patientUid)

    res.status(200).json({
      message: "Retrieved deciduous chart",
      payload: deciduousChart,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting deciduous chart: ${e.message}`,
    })
  }
}

async function getDental(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const dentalChart = await doGetDental(patientUid)

    res.status(200).json({
      message: "Retrieved dental chart",
      payload: dentalChart,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting dental chart: ${e.message}`,
    })
  }
}

async function getMedical(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const medicalChart = await doGetMedical(patientUid)

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

async function setDeciduous(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetDeciduous(patientUid, dataUrl)

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

async function setDental(req, res) {
  try {
    const patientUid = req.params.patientUid
    const dataUrl = req.body.dataUrl

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    if (!dataUrl) throw new HttpError("Missing or invalid data URL", 400)

    await doSetDental(patientUid, dataUrl)

    res.status(200).json({
      message: "Updated dental chart",
      payload: {
        dataUrl,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while updating dental chart: ${e.message}`,
    })
  }
}

async function setMedical(req, res) {
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

    // Update name in Firebase Auth.
    await auth.updateUser(patientUid, {
      displayName: personalInformation.fullName,
    })

    // Update name in root user collection.
    db.collection("users").doc(uid).set(
      {
        displayName: personalInformation.fullName,
      },
      {
        merge: true,
      }
    )

    // Update medical chart itself.
    await doSetMedical(
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

async function isFilledInMedicalChart(req, res) {
  try {
    const { patientUid } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    const filledIn = await doIsFilledInMedicalChart(patientUid)

    res.status(200).json({
      message: "Retrieved filled in status of medical chart",
      payload: filledIn,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while retrieving filled in status of medical chart: ${e.message}`,
    })
  }
}

async function setFilledInMedicalChart(req, res) {
  try {
    const { patientUid } = req.params

    if (!patientUid) throw new HttpError("Missing or invalid patient UID", 400)

    await doSetFilledInMedicalChart(patientUid)

    res.status(200).json({
      message: "Medical chart filled in set",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while setting medical chart as filled in: ${e.message}`,
    })
  }
}

module.exports = {
  getDeciduous,
  setDeciduous,
  getDental,
  setDental,
  getMedical,
  setMedical,
  isFilledInMedicalChart,
  setFilledInMedicalChart,
}
