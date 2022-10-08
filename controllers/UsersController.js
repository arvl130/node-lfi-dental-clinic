const HttpError = require("../helpers/HttpError")
const { getFirstN: doGetFirstN, get: doGet } = require("../models/Users")

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

module.exports = {
  getFirstN,
  get,
}
