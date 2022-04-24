const registerAdminUser = require("../../helpers/registerAdminUser");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      throw new HttpError("Missing or invalid email", 400);
    }

    if (!password) {
      throw new HttpError("Missing or invalid password", 400);
    }

    if (password && password.length < 8) {
      throw new HttpError("Password too short", 400);
    }

    const user = await registerAdminUser(email, password);

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
