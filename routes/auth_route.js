const express = require("express");
const router = express.Router();
const { registerUser, verifyToken } = require("../management/auth_manage");
const auth = require("../middleware/auth");
const objectIdVerify = require("../middleware/object_id");

router.post("/", registerUser);
router.get("/verify", [auth, objectIdVerify], verifyToken);

module.exports = router;
