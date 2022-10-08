const express = require("express")
const router = express.Router()

const { create, remove, getAll } = require("../controllers/MessagesController")

router.get("/", getAll)
router.put("/", create)
router.delete("/:uid/delete", remove)

module.exports = router
