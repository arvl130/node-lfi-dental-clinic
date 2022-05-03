const createSlotRecord = require("../../helpers/timeslots/createSlotRecord");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const slotSeconds = req.body.slotSeconds;
    const patientUid = req.body.patientUid;
    const service = req.body.service;

    if (!slotSeconds)
      throw new HttpError(
        `Missing or invalid slot seconds: ${slotSeconds}`,
        400
      );

    if (!patientUid)
      throw new HttpError(`Missing or invalid patient UID: ${patientUid}`, 400);

    if (!service)
      throw new HttpError(`Missing or invalid service: ${service}`, 400);

    await createSlotRecord(slotSeconds, {
      patientUid,
      service,
      status: "taken",
    });

    res.status(200).json({
      message: "New appointment created",
      payload: slotSeconds,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating new appointment: ${e.message}`,
    });
  }
};
