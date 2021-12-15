const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const objectIdVerify = require("../middleware/object_id");

const { getGlobalLeaderboard } = require("../management/leaderboard_manage");

router.get("/global", [auth, objectIdVerify], getGlobalLeaderboard);

module.exports = router;
