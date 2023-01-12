const express = require("express")
const router = express.Router()

const requirePatientToken = require("../middleware/requirePatientToken")
const requirePatientOrAdminToken = require("../middleware/requirePatientOrAdminToken")
const requireAdminToken = require("../middleware/requireAdminToken")

const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

router.get("/", requireAdminToken, async (req, res) => {
  try {
    const docSnap = await db.collection("reminders").doc("reminders").get()

    if (docSnap.exists) {
      const { message } = docSnap.data()
      res.status(200).json({
        message: `Reminders retrieved`,
        payload: {
          message,
        },
      })
    } else {
      res.status(200).json({
        message: `Reminders retrieved`,
        payload: "",
      })
    }
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while getting list of users: ${e.message}`,
    })
  }
})
router.post("/", requireAdminToken, async (req, res) => {
  try {
    const { message } = req.body

    if (!message)
      throw new HttpError("Missing or invalid message to search with", 400)

    await db.collection("reminders").doc("reminders").set(
      {
        message,
      },
      {
        merge: true,
      }
    )

    res.status(200).json({
      message: `Reminders set`,
    })
  } catch (e) {
    res.status(e.httpErrorCode || 500).json({
      message: `Error occured while setting reminders: ${e.message}`,
    })
  }
})

module.exports = router
