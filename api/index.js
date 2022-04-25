const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

require('dotenv').config();
const config = require('../src/config');

const userRouter = require('../src/routes/user');
const getNews = require('../src/routes/getNews');

const app = express();
app.set('trust proxy', 1);
//---------------------------------------- End of import ----------

if (true) {
  app.use(async (req, res, next) => {
    const URL =
      'mongodb+srv://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PASSWORD +
      '@' +
      process.env.MONGO_PROJECTNAME +
      '.mongodb.net/' +
      process.env.MONGO_DATABASE +
      '?retryWrites=true&w=majority';

    await mongoose.connect(URL, {
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
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, //access-control-allow-credentials:true
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, sameSite: 'none' },
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://' +
        process.env.MONGO_USER +
        ':' +
        process.env.MONGO_PASSWORD +
        '@' +
        process.env.MONGO_PROJECTNAME +
        '.mongodb.net/' +
        process.env.MONGO_DATABASE +
        '?retryWrites=true&w=majority',
    }),
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('../src/passport/passportConfig')(passport);

app.use('/users', userRouter);
app.use('/getnews', getNews);
//---------------------------------- End of middleware ---------------

module.exports = app;
