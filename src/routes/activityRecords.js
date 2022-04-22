const express = require("express");
const router = express.Router();
const User = require("../models/User");

// get all of activities
router.post("/", async (req, res) => {
  const userProfile = await User.findOne({ username: req.body.username });
  const userRecords = userProfile.activityRecords;
  return res.status(200).send(userRecords);
});

// get activity by id
// router.get("/:recordId", (req, res, next) => {
//   return res.status(200).send(req.activityRecord);
// });

// create activity record
router.post("/create", async (req, res) => {
  const body = req.body;
  const userProfile = await User.findOne({ username: body.username });
  const userRecords = userProfile.activityRecords;
  if (userRecords.length > 0) {
    body.id = userRecords[userRecords.length - 1].id + 1;
  } else {
    body.id = 1;
  }

  userProfile.activityRecords.push(body);
  await userProfile.save();
  return res.status(201).send("Created successful!!");
});

//updating record
router.put("/update", async (req, res, next) => {
  const body = req.body;
  const userProfile = await User.findOne({ username: body.username });
  const userRecords = userProfile.activityRecords;
  const recordIndex = userRecords.findIndex((record) => {
    return record.id === +body.id;
  });

  userRecords[recordIndex] = {
    ...userRecords[recordIndex],
    ...body,
  };
  await userProfile.save();
  return res.status(201).send(userRecords);
});

// delete record
router.delete("/:username/:recordId", async (req, res, next) => {
  const { username, recordId } = req.params;
  const userProfile = await User.findOne({ username: username });
  const userRecords = userProfile.activityRecords;
  const recordIndex = userRecords.findIndex((record) => {
    return record.id === +recordId;
  });

  userRecords.splice(recordIndex, 1);
  await userProfile.save();
  return res.status(204).send(userRecords);
});

module.exports = router;
