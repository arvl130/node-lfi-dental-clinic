const registerPatientUser = require("../../helpers/registerPatientUser");
const HttpError = require("../../helpers/HttpError");

module.exports = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;

    if (!email) {
      throw new HttpError("Missing or invalid email", 400);
    }

    if (!password) {
      throw new HttpError("Missing or invalid password", 400);
    }

    if (password && password.length < 8) {
      throw new HttpError("Password too short", 400);
    }

    if (!fullName) {
      throw new HttpError("Missing or invalid full name", 400);
    }

    const user = await registerPatientUser(email, password, fullName);

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
