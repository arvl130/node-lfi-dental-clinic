const { DateTime } = require("luxon");

module.exports = (slotSeconds) => {
  const month = new Date(slotSeconds * 1000).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    month: "numeric",
  });

  const year = new Date(slotSeconds * 1000).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
  });

  const isoDateStr = DateTime.fromObject(
    {
      year,
      month,
    },
    {
      zone: "Asia/Manila",
    }
  ).toISO();

  return new Date(isoDateStr).getTime() / 1000;
};
