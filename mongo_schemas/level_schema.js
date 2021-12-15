const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
  levelID: { type: Number, required: true },
  levelName: { type: String, required: true },
  levelDesc: { type: String, required: true },
  startingNo: { type: Number, required: true },
  endingNo: { type: Number, required: true },
  commonDiff: { type: Number, required: true, default: 1 },
  axisCount: { type: Number, required: true, default: 3 },
  threeStarTime: { type: Number, required: true },
  twoStarTime: { type: Number, required: true },
  oneStarTime: { type: Number, required: true },
});

const LevelDB = mongoose.model("Levels", levelSchema);

module.exports = LevelDB;
