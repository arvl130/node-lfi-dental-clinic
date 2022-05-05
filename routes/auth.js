const express = require("express");
const router = express.Router();

const registerAdminUser = require("../controllers/auth/registerAdminUser");
const registerPatientUser = require("../controllers/auth/registerPatientUser");

router.post("/register/admin", registerAdminUser);
router.post("/register", registerPatientUser);

module.exports = router;
