const express = require("express")
const router = express.Router()

const {
  create,
  remove,
  getAll,
  toggleArchiveStatus,
} = require("../controllers/MessagesController")

const requireAdminToken = require("../middleware/requireAdminToken")

router.get("/", requireAdminToken, getAll)
router.put("/", create)
router.delete("/:uid/delete", requireAdminToken, remove)
router.patch("/:uid", requireAdminToken, toggleArchiveStatus)

module.exports = router
