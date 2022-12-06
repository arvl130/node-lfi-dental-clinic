const HttpError = require("../helpers/HttpError")
const {
  getFirstN: doGetFirstN,
  get: doGet,
  getAnyN: doGetAnyN,
  getArchivedAnyN: doGetArchivedAnyN,
  getByName: doGetByName,
  getArchivedByName: doGetArchivedByName,
  setArchived: doSetArchived,
  setNotArchived: doSetNotArchived,
} = require("../models/Users")

async function getFirstN(req, res) {
  try {
    const numberOfUsers = 5
    const startAtUid = req.query.startWith
    const usersList = startAtUid
      ? await doGetFirstN(numberOfUsers + 1, startAtUid)
      : await doGetFirstN(numberOfUsers + 1)

    // Return only the first 5 items. The last item is set as a page
    const nextValueUid = usersList.splice(numberOfUsers, 1)[0]?.uid

    res.status(200).json({
      message: `List of users (${numberOfUsers})`,
      payload: {
        users: usersList,
        nextValueUid,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function get(req, res) {
  try {
    const patientUid = req.params.patientUid

    if (!patientUid)
      throw new HttpError("Missing or invalid dental history", 400)

    const userRecord = await doGet(patientUid)

    res.status(200).json({
      message: "User profile retrieved",
      payload: {
        uid: patientUid,
        userRecord,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting user profile: ${e.message}`,
    })
  }
}

async function getAnyN(req, res) {
  try {
    const upToNUsers = 8
    const usersList = await doGetAnyN(upToNUsers)

    res.status(200).json({
      message: `List of users`,
      payload: {
        users: usersList,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function getArchivedAnyN(req, res) {
  try {
    const upToNUsers = 8
    const usersList = await doGetArchivedAnyN(upToNUsers)

    res.status(200).json({
      message: `List of users`,
      payload: {
        users: usersList,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function getByName(req, res) {
  try {
    const { nameFilter } = req.params

    if (!nameFilter)
      throw new HttpError("Missing or invalid name to search with", 400)

    const usersList = await doGetByName(nameFilter)

    res.status(200).json({
      message: `List of matching users`,
      payload: {
        users: usersList,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function getArchivedByName(req, res) {
  try {
    const { nameFilter } = req.params

    if (!nameFilter)
      throw new HttpError("Missing or invalid name to search with", 400)

    const usersList = await doGetArchivedByName(nameFilter)

    res.status(200).json({
      message: `List of matching archived users`,
      payload: {
        users: usersList,
      },
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function setArchived(req, res) {
  try {
    const { patientUid } = req.params

    if (!patientUid)
      throw new HttpError("Missing or invalid patient UID to search with", 400)

    await doSetArchived(patientUid)

    res.status(200).json({
      message: `Patient is now archived`,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

async function setNotArchived(req, res) {
  try {
    const { patientUid } = req.params

    if (!patientUid)
      throw new HttpError("Missing or invalid patient UID to search with", 400)

    await doSetNotArchived(patientUid)

    res.status(200).json({
      message: `Patient is now unarchived`,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
}

module.exports = {
  getFirstN,
  getAnyN,
  getArchivedAnyN,
  get,
  getByName,
  getArchivedByName,
  setArchived,
  setNotArchived,
}
