const listUsers = require("../../helpers/users/listUsers");

module.exports = async (req, res) => {
  try {
    const usersList = await listUsers();

    res.status(200).json({
      message: "List of users",
      payload: usersList,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    });
  }
};
