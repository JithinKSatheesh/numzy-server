const express = require("express");

const { initializeRoutes } = require("./stratup/routes");
const { connectToDB } = require("./stratup/db_connect");
const { initializeProtection } = require("./stratup/data_protection");
const { initalizeFcm } = require("./management/fcm_manage");
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const PORT = process.env.PORT || 8000;

const express_app = express();
express_app.use(express.json());

//Connect to db
connectToDB();

//Initialize FCM
initalizeFcm();

// Initialize Routes
initializeRoutes(express_app);
// Initialize for protection
initializeProtection(express_app);

express_app.listen(PORT, () => console.log(`Listening on ${PORT}`));
