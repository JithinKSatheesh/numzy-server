const auth_route = require("../routes/auth_route");
const profile_route = require("../routes/profile_route");
const gameplay_route = require("../routes/gameplay_route");
const leaderboard_route = require("../routes/leaderboard_route");

function initializeRoutes(express_app) {
  express_app.use("/api/v1/auth", auth_route);
  express_app.use("/api/v1/user", profile_route);
  express_app.use("/api/v1/gameplay", gameplay_route);
  express_app.use("/api/v1/leaderboard", leaderboard_route);
}

exports.initializeRoutes = initializeRoutes;
