const {
  create: doCreate,
  remove: doRemove,
  getAll: doGetAll,
} = require("../models/Messages")

async function remove(req, res) {
  try {
    const uid = req.params.uid

    if (!uid) {
      const error = new Error("Missing or invalid UID")
      error.httpErrorCode = 400
      throw error
    }

    const message = doRemove(uid)

    res.status(200).json({
      message: "Message deleted",
      payload: message,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while deleting message",
    })
  }
}

async function getAll(req, res) {
  const messages = await doGetAll()

  res.status(200).json({
    message: "List of all messages",
    payload: messages,
  })
}

async function create(req, res) {
  try {
    const subject = req.body.subject
    const body = req.body.body
    const senderName = req.body.senderName

    if (!subject) {
      const error = new Error("Missing or invalid message subject")
      error.httpErrorCode = 400
      throw error
    }

    if (!body) {
      const error = new Error("Missing or invalid message body")
      error.httpErrorCode = 400
      throw error
    }

    if (!senderName) {
      const error = new Error("Missing or invalid sender name")
      error.httpErrorCode = 400
      throw error
    }

    const message = await doCreate({
      subject,
      body,
      senderName,
    })

    res.status(200).json({
      message: "Message created",
      payload: message,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: e.message || "Error occured while creating message",
    })
  }
}

module.exports = {
  create,
  remove,
  getAll,
}
