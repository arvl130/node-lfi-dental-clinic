const express = require("express")
const router = express.Router()

const {
  create,
  remove,
  getAll,
  toggleArchiveStatus,
} = require("../controllers/MessagesController")

router.get("/", getAll)
router.put("/", create)
router.delete("/:uid/delete", remove)
router.patch("/:uid", toggleArchiveStatus)

module.exports = router
