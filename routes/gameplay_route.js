const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const objectIdVerify = require("../middleware/object_id");
const {
  getAllLevels,
  levelDetails,
  levelCompleted,
} = require("../management/level_manage");

router.get("/levels", [auth, objectIdVerify], getAllLevels);
router.get("/levelinfo/:id", [auth, objectIdVerify], levelDetails);
router.post("/levelcompleted", [auth, objectIdVerify], levelCompleted);

module.exports = router;
