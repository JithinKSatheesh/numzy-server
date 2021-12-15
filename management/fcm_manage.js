var admin = require("firebase-admin");
const { PlayerDB } = require("../mongo_schemas/player_schema");
var serviceAccount = require("../config/games-banzan-numzy-firebase-adminsdk-ref37-f686d68a13.json");

var registrationToken =
  "fH6sEvFHRdmQ5LjdFRhDvX:APA91bHRTBUqcGTh2bjx5qWJm8EUMhqIXUtr2RHJyuxT5TXDilmd_lwYGSKJsawgQV_vi0Nu7ncB0zqFyeG1XODZHVpNmDVAp9On43Q03YfvySiL_mCjlDm3uM_yawZKr9O49kkZHoSx";

module.exports.initalizeFcm = async (message) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://games-banzan-numzy.firebaseio.com",
  });
};

module.exports.sendFcmMessage = async (msg, userID) => {
  //console.log("Sending FCM");
  let fcmtoken = await getFcmToken(userID);
  if (!fcmtoken) {
    //console.log("FCM token empty, return");
    return;
  }
  var message = {
    notification: {
      title: "Numzy",
      body: msg,
    },
    token: fcmtoken,
  };

  // Send a message to the device corresponding to the provided
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Successful
      //console.log("FCM send successful\n", response);
    })
    .catch((error) => {
      //Error
      //console.log("FCM send Unsuccessful\n", error);
    });
};

async function getFcmToken(userID) {
  const playerDetails = await PlayerDB.findOne({ _id: userID });
  if (!playerDetails) {
    return null;
  }
  return await playerDetails.fcmtoken;
}
