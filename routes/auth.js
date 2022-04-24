const express = require("express");
const router = express.Router();

const registerAdminUser = require("../controllers/auth/registerAdminUser");

router.post("/register/admin", registerAdminUser);

module.exports = router;
