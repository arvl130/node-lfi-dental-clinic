const { DateTime } = require("luxon");

module.exports = (year, month) => {
  const currMonthISODateStr = DateTime.fromObject(
    {
      year,
      month,
    },
    {
      zone: "Asia/Manila",
    }
  ).toISO();
  return new Date(currMonthISODateStr).getTime() / 1000;
};
