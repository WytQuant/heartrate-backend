const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const router = express.Router();
const User = require("../models/User");
const activityRecords = require("./activityRecords");
const MongoStore = require("connect-mongo");

// defined router user record activities path
router.use("/me/records", activityRecords);

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_PROJECTNAME}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    }),
  })
);

router.use(cookieParser(process.env.SESSION_SECRET));
router.use(passport.initialize());
router.use(passport.session());
require("../passport/passportConfig")(passport);

// CRUD
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("Your email or password was wrong!");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

router.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("Created new user!!");
    }
  });
});

router.get("/me", (req, res) => {
  res.send(req.user);
});

module.exports = router;
