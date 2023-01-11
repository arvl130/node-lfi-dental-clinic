const HttpError = require("../helpers/HttpError")
const {
  createAdmin,
  createPatient,
  updateFullName: doUpdateFullName,
} = require("../models/Users")

async function registerAdmin(req, res) {
  try {
    const email = req.body.email
    const password = req.body.password

    if (!email) {
      throw new HttpError("Missing or invalid email", 400)
    }

    if (!password) {
      throw new HttpError("Missing or invalid password", 400)
    }

    if (password && password.length < 8) {
      throw new HttpError("Password too short", 400)
    }

    const user = await createAdmin(email, password)

    res.status(200).json({
      message: "User created",
      payload: user,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating user: ${e.message}`,
    })
  }
}

async function registerPatient(req, res) {
  try {
    const email = req.body.email
    const password = req.body.password
    const fullName = req.body.fullName

    if (!email) {
      throw new HttpError("Missing or invalid email", 400)
    }

    if (!password) {
      throw new HttpError("Missing or invalid password", 400)
    }

    if (password && password.length < 8) {
      throw new HttpError("Password too short", 400)
    }

    if (!fullName) {
      throw new HttpError("Missing or invalid full name", 400)
    }

    const user = await createPatient(email, password, fullName)

    res.status(200).json({
      message: "User created",
      payload: user,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating user: ${e.message}`,
    })
  }
}

async function updateFullName(req, res) {
  try {
    const { fullName } = req.body

    if (!fullName) {
      throw new HttpError("Missing or invalid email", 400)
    }

    console.log(req.userId)
    await doUpdateFullName(req.userId, fullName)

    res.status(200).json({
      message: "User full name updated",
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while creating user: ${e.message}`,
    })
  }
}

module.exports = {
  registerAdmin,
  registerPatient,
  updateFullName,
}
