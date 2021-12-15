const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const objectIdVerify = require("../middleware/object_id");

const {
  getProfile,
  updateProfile,
  avatars,
} = require("../management/profile_manage");

router.get("/me", [auth, objectIdVerify], getProfile);
router.post("/me", [auth, objectIdVerify], updateProfile);
router.get("/customavatars", [auth, objectIdVerify], avatars);

module.exports = router;
