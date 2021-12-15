const handler = require("../middleware/async");
const LevelDB = require("../mongo_schemas/level_schema");
const { PlayerDB, CompletedLevel } = require("../mongo_schemas/player_schema");
const { sendFcmMessage } = require("../management/fcm_manage");
// Validations
const {
  valiateLevelCompletedDetails,
} = require("../validations/level_completed");

// Schemas

/*
 ************************* Calling this API to get all levels ********************************
 */

exports.getAllLevels = handler(async (req, res) =>
{
  const userID = req.user.id;
  // Getting all levels from Level DB
  let levelsArray = await LevelDB.find({}).sort({ levelID: 1 });
  // Getting all user completed levels
  let playerDetails = await PlayerDB.findOne({ _id: userID });
  let completedLevelArray = await playerDetails.completedlevels;
  //console.log('completed levels : ',completedLevelArray.length);
  //console.log('completed levels : ',completedLevelArray);
  // Creating new array and getting ready for response
  var newArray = [];
  levelsArray.forEach((level) =>
  {
    newArray.push({
      levelID: level.levelID,
      name: level.levelName,
      // desc: level.levelDesc,
      // axis_count: level.axisCount,
      // start_no: level.startingNo,
      // end_no: level.endingNo,
      // com_diff: level.commonDiff,
      earnedStars: 0,
      locked: true,
    });
  });
  //console.log('total levels : ',newArray.length);
  //console.log('total levels : ',newArray);
  // // Merging with User completed levels
  for (var i = 0; i < completedLevelArray.length; i++)
  {
    for (var j = 0; j < newArray.length; j++)
    {
      if (completedLevelArray[i].levelID === newArray[j].levelID)
      {
        newArray[j].earnedStars = completedLevelArray[i].earnedStars;
        newArray[j].locked = false;
      }
    }
  }
  // Searching for next playable level
  for (var i = 0; i < newArray.length; i++)
  {
    if (newArray[i].locked)
    {
      newArray[i].locked = false;
      break;
    }
  }
  // sending response back
  res.json({ success: true, data: newArray });
});
/*
 ************************* Calling this API for single level information ********************************
 */

exports.levelDetails = handler(async (req, res) =>
{
  // let lastLevelID = 100;
  // let level = await LevelDB.find({ levelID: req.params.id }, "-_id -__v");
  // if (level === null || level.length == 0)
  // {
  //   return res.status(400).json({ success: false, error: "Invalid levelID" });
  // }
  // res.json({ success: true, data: level[0] });
  var isfound = false;
  let levelsArray = await LevelDB.find({}).sort({ levelID: 1 });
  levelsArray.forEach((level, index, array) =>
  {
    if (level.levelID == req.params.id)
    {
      isfound = true;
      let isFinal = level.levelID == levelsArray[levelsArray.length - 1].levelID;
      res.json({ success: true, data: level, isFinalLevel: isFinal });
    }
  });
  if (!isfound)
  {
    res.status(400).json({ success: false, error: "Invalid levelID" });
  }

});

/*
 ************************* Calling this API when a game level is completed ********************************
 */

exports.levelCompleted = handler(async (req, res) =>
{
  const userID = req.user.id;
  // Validating input details
  const { error } = valiateLevelCompletedDetails(req.body);
  // If input details are invalid
  if (error)
  {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  // Getting player Details
  const playerDetails = await PlayerDB.findOne({ _id: userID });
  // Creating completed level object
  const data = CompletedLevel({
    earnedStars: req.body.earnedStars,
    levelID: req.body.levelID,
  });
  // Getting player completed levels
  const levels = await playerDetails.completedlevels;
  // Seaching for user already played the level ( -1 not played)
  var index = -1;
  for (var i = 0; i < levels.length; i++)
  {
    if (levels[i].levelID === req.body.levelID)
    {
      index = i;
      break;
    }
  }
  // If user not played, push it to user completed levels
  if (index === -1)
  {
    await playerDetails.completedlevels.push(data);
    // Check for achievements to unlock
    await checkForAchievementsToUnlock(req.body.levelID, userID);
  }
  // Else update the level
  else
  {
    await playerDetails.completedlevels.set(index, data);
  }
  // saving score
  var currentScore = await playerDetails.score;
  currentScore += await getScoreFromCompletedTime(req.body.completedtime);
  playerDetails.score = currentScore;
  // saving data
  await playerDetails.save();
  // Sending response back
  res.json({ success: true });
});

async function getScoreFromCompletedTime(timeTakenToComplete)
{
  /* Total numbers in game is 25 
  score is (25 - timetaken)/25 *100
  */
  let factor = 25 - timeTakenToComplete;
  if (factor <= 0) return 4;
  else return factor * 4;
}

async function checkForAchievementsToUnlock(levelID, userID)
{
  // console.log(
  //   "Cheking for achievements to unlock on level ",
  //   levelID,
  //   typeof levelID
  // );
  const achievementsMap = new Map();
  // Kiddo
  achievementsMap.set(
    1,
    "https://res.cloudinary.com/banzan/image/upload/v1589698733/Numzy/profile/badges/badge_kiddo_ig3gwv.png"
  );
  // Rookie
  achievementsMap.set(
    6,
    "https://res.cloudinary.com/banzan/image/upload/v1589698734/Numzy/profile/badges/badge_rookie_tlhdde.png"
  );
  // Bravo
  achievementsMap.set(
    16,
    "https://res.cloudinary.com/banzan/image/upload/v1589698734/Numzy/profile/badges/badge_bravo_ku69uk.png"
  );
  // Champ
  achievementsMap.set(
    26,
    "https://res.cloudinary.com/banzan/image/upload/v1589703345/Numzy/profile/badges/badge_champ_wwonnf.png"
  );
  // Steller
  achievementsMap.set(
    51,
    "https://res.cloudinary.com/banzan/image/upload/v1589698733/Numzy/profile/badges/badge_steller_qhh8lc.png"
  );
  // Pro
  achievementsMap.set(
    76,
    "https://res.cloudinary.com/banzan/image/upload/v1589698734/Numzy/profile/badges/badge_pro_p4uljf.png"
  );
  achievementsMap.set(
    101,
    "https://res.cloudinary.com/banzan/image/upload/v1594395132/Numzy/profile/badges/badge_superstar_wpgtbj.png"
  );

  if (achievementsMap.get(levelID) != undefined)
  {
    //Send FCM
    //console.log("Achievement Unlocked");
    sendFcmMessage("Achievement Unlocked", userID);
    addAchievement(userID, achievementsMap.get(levelID));
  } else
  {
    //console.log("no Achievements to Unlock");
  }
}

async function addAchievement(userID, achievementUrl)
{
  const playerDetails = await PlayerDB.findOne({ _id: userID });
  await playerDetails.achievements.push(achievementUrl);
  await playerDetails.save();
}
