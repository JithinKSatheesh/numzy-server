const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const playedLevelsSchema = mongoose.Schema({
  earnedStars: {
    type: Number,
    required: true,
    default: 0
  },
  levelID: {
    type: Number,
    required: true
  },
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  score: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    required: true,
  },
  profileCustomImage: {
    type: String,
    required: true,
  },
  fcmtoken: {
    type: String,
    required: true
  },
  completedlevels: [playedLevelsSchema],
  achievements: [String],
});

const PlayerDB = mongoose.model("PlayerDB", userSchema);
const CompletedLevels = mongoose.model("completed_levels", playedLevelsSchema);

module.exports.PlayerDB = PlayerDB;
module.exports.CompletedLevel = CompletedLevels;