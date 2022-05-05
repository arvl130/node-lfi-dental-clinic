const createSlotRecord = require("../../helpers/timeslots/createSlotRecord");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.body.slotSeconds;

    if (!slotSeconds)
      throw new HttpError("Missing or invalid slot seconds", 400);

    await createSlotRecord(slotSeconds, "closed");

    res.status(200).json({
      message: "Closed slot added",
      payload: slotSeconds,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while adding closed dates",
    });
  }
};
