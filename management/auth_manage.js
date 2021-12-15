const { PlayerDB } = require("../mongo_schemas/player_schema");
const handler = require("../middleware/async");
const {
  validateRegistrationDetails,
} = require("../validations/auth_validation");
const { generateToken } = require("../management/token_manage");

/**
 * Function to create new User
 * If user was already registered with the email(unique), it will take the old user
 *  */
exports.registerUser = handler(async (req, res) => {
  // Validating input details
  const { error } = validateRegistrationDetails(req.body);
  // If input details are invalid
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  // If input details are valid check for the user in PlayerDB
  const oldUser = await PlayerDB.findOne({ email: req.body.email });
  // If user not found, Create a new user and save else return the old user
  if (!oldUser) {
    // Creating new user
    let newUser = PlayerDB({
      name: req.body.name,
      email: req.body.email,
      profileImage: req.body.image,
      profileCustomImage: req.body.image,
      fcmtoken: req.body.fcmtoken,
      completedlevels: [],
      achievemants: [],
    });
    // Saving new user
    let temp_new_user = await newUser.save();
    // Generating token
    let token = generateToken(temp_new_user._id);
    // Sending response
    return res.json({ success: true, token: token });
  } else {
    oldUser.fcmtoken = req.body.fcmtoken;
    await oldUser.save();
    // Generating token from old user
    let token = generateToken(oldUser._id);
    // Sending response
    return res.json({ success: true, token: token });
  }
});

exports.verifyToken = (req, res) => {
  res.json({ success: true, data: "Token verified" });
};
