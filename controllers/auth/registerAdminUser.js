const registerAdminUser = require("../../helpers/registerAdminUser");
const HttpError = require("../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
      throw new HttpError("Missing or invalid username", 400);
    }

    if (!password) {
      throw new HttpError("Missing or invalid password", 400);
    }

    const user = await registerAdminUser(username, password);

    res.status(200).json({
      message: "User created",
      payload: user,
    });
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating user: ${e.message}`,
    });
  }
};
