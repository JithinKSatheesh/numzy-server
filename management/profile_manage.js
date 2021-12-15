const handler = require("../middleware/async");
const { PlayerDB } = require("../mongo_schemas/player_schema");
const {
  validateUpdateProfileDetails,
} = require("../validations/profile_validation");

/************************* API to get prifile details************************/

exports.getProfile = handler(async (req, res) => {
  const userID = req.user.id;
  const user = await PlayerDB.findOne({ _id: userID }, [
    "name",
    "email",
    "profileCustomImage",
    "score",
    "achievements",
    "-_id",
  ]);
  if (!user) {
    return res.status(404).json({ success: false, error: "Invalid token" });
  }
  return res.json({ success: true, data: user });
});

/************************* API to Update prifile details************************/

exports.updateProfile = handler(async (req, res) => {
  const { error } = validateUpdateProfileDetails(req.body);
  // If input details are invalid
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  const userID = req.user.id;
  const { name, image } = req.body;
  const user = await PlayerDB.findOne({ _id: userID });
  user.name = name;
  user.profileCustomImage = image;
  const result = await user.save();
  const newUser = await PlayerDB.findOne({ _id: userID }, [
    "name",
    "email",
    "profileCustomImage",
    "score",
    "achievements",
    "-_id",
  ]);
  return res.json({ success: true, data: newUser });
});

/************************* API to different avatar images ************************/

exports.avatars = handler(async (req, res) => {
  const userID = req.user.id;
  const user = await PlayerDB.findOne({ _id: userID });
  if (!user) {
    return res.status(404).json({ success: false, error: "Invalid token" });
  }
  var avatarArray = [
    "https://res.cloudinary.com/banzan/image/upload/v1589609689/Numzy/profile/custom_avatars/Asset_91x_keohnn_ys3npv.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609689/Numzy/profile/custom_avatars/Asset_31x_dds5me_bv6rb7.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609687/Numzy/profile/custom_avatars/Asset_21x_irhmu5_diamyf.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609686/Numzy/profile/custom_avatars/Asset_71x_v8qhcd_htxsrg.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609686/Numzy/profile/custom_avatars/Asset_51x_dbejcl_wrxttj.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609686/Numzy/profile/custom_avatars/Asset_81x_pkqvox_lqytyn.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609686/Numzy/profile/custom_avatars/Asset_11x_j2msxd_tfbjdg.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609685/Numzy/profile/custom_avatars/Asset_41x_p5h8tz_db9td7.png",
    "https://res.cloudinary.com/banzan/image/upload/v1589609685/Numzy/profile/custom_avatars/Asset_61x_czpqis_hax6s9.png",
  ];
  avatarArray.push(user.profileImage);
  return res.json({ success: true, data: avatarArray });
});
