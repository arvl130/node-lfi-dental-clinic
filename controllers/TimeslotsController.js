const {
  create,
  remove,
  getClosed: doGetClosed,
  getUnavailable: doGetUnavailable,
} = require("../models/Timeslots")
const HttpError = require("../helpers/HttpError")

async function addClosed(req, res) {
  try {
    const slotSeconds = req.body.slotSeconds

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400)

    await create(slotSeconds, "closed")

    res.status(200).json({
      message: "Closed slot added",
      payload: slotSeconds,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while adding closed dates",
    })
  }
}

async function deleteClosed(req, res) {
  try {
    const slotSeconds = req.params.slotSeconds

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      )

    await remove(slotSeconds)

    res.status(200).json({
      message: "Closed slot deleted",
      payload: slotSeconds,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while deleting closed dates",
    })
  }
}

async function getClosed(req, res) {
  try {
    const year = req.params.year
    const month = req.params.month

    if (!year) throw new HttpError("Missing or invalid year", 400)
    if (!month) throw new HttpError("Missing or invalid month", 400)

    const closedSlots = await doGetClosed(year, month)

    res.status(200).json({
      message: "List of dates closed in Unix seconds",
      payload: closedSlots,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while getting closed dates",
    })
  }
}

async function getUnavailable(req, res) {
  try {
    const month = req.params.month
    const year = req.params.year

    if (!month) throw new HttpError("Missing or invalid month", 400)
    if (!year) throw new HttpError("Missing or invalid year", 400)

    const unavailableSlots = await doGetUnavailable(year, month)

    res.status(200).json({
      message: "List of unavailable timeslots",
      payload: unavailableSlots,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting available slots: ${e.message}`,
    })
  }
}

module.exports = {
  addClosed,
  deleteClosed,
  getClosed,
  getUnavailable,
}
