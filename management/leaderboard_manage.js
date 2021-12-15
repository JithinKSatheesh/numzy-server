const handler = require("../middleware/async");
const { PlayerDB } = require("../mongo_schemas/player_schema");

exports.getGlobalLeaderboard = handler(async (req, res) =>
{
  const leaderboardLimit = 50;
  // User id
  const userID = req.user.id;
  //Getting 50 Player scores in decending order
  const scoreArray = await PlayerDB.find({ score: { $gte: 0 } }, [
    "name",
    "score",
    "profileCustomImage",
    "achievements",
    "_id",
  ])
    .sort({ score: -1 })
    .limit(leaderboardLimit);
  //Get current user details
  const currentUserData = await PlayerDB.findOne({ _id:userID }, [
    "name",
    "score",
    "profileCustomImage",
    "achievements",
    "_id",
  ]);
  // Search if user already exist in the top 50 , if not found returns -1
  let userfound = scoreArray.forEach((user)=>user._id.equals(currentUserData._id));
  if(userfound == -1)
  {
    //console.log('User not in top 50. adding user');
    scoreArray.push(currentUserData);
  }else{
    //console.log('User in top 50');
  }
  // 
  var leaderBoardResponseArray = [];
  scoreArray.forEach((user)=>{
    //console.log(user._id ,"==", currentUserData._id);

    leaderBoardResponseArray.push({
      name: user.name,
      profileCustomImage : user.profileCustomImage,
      score:user.score,
      badge : user.achievements,
      highlight:user._id.equals(currentUserData._id),
  });
  });
  
  res.json({ success: true, data: leaderBoardResponseArray });
});
