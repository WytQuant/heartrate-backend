const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const config = require("../config");
const PORT = config.port;

const router = require("../routes/user");
const getNews = require("../routes/getNews");

const app = express();
app.set("trust proxy", 1);
//---------------------------------------- End of import ----------

if (config.isVercel) {
  app.use(async (req, res, next) => {
    await mongoose.connect(config.mongoUri, config.mongoOptions, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return next();
  });
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  })
);

app.use("/users", router);
app.use("/getnews", getNews);
//---------------------------------- End of middleware ---------------

module.exports = app;
