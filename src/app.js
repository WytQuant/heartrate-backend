const mongoose = require('mongoose');
const app = require('../api/index');
const config = require('./config');
//----------------------- Starting server ---------------------

const boot = async () => {
  //start connented at mongo db
  await mongoose.connect(config.mongoUri, config.mongoOptions, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //start express server
  app.listen(config.port, () => {
    console.log(`Server is listening on ${config.port}`);
  });
};

boot();
