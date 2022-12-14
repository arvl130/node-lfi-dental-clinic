const {
  create: doCreate,
  remove: doRemove,
  getAll: doGetAll,
  toggleArchiveStatus: doToggleArchiveStatus,
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
    const { body, email, senderName } = req.body

    if (!email) {
      const error = new Error("Missing or invalid message email")
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
      email,
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

async function toggleArchiveStatus(req, res) {
  try {
    const uid = req.params.uid

    if (!uid) {
      const error = new Error("Missing or invalid UID")
      error.httpErrorCode = 400
      throw error
    }

    const { newStatus } = await doToggleArchiveStatus(uid)

    res.status(200).json({
      message: `Message is now ${newStatus}`,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message:
        e.message || "Error occured while changing message archive status",
    })
  }
}

module.exports = {
  create,
  remove,
  getAll,
  toggleArchiveStatus,
}
