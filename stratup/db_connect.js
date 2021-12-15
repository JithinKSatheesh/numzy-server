const mongoose = require("mongoose");
const config = require("config");
function connectToDB() {
  const mongoConnectionString = config.get("dbpath");
  mongoose
    .connect(mongoConnectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log("error Connecting to db : ",err));
}

exports.connectToDB = connectToDB;
