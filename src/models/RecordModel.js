const mongoose = require("mongoose");

const actRecordSchema = new mongoose.Schema({
  id: { type: Number },
  username: { type: String },
  activityName: {
    type: String,
    minlength: [4, "Activity name must contains at least 4 character"],
  },
  description: {
    type: String,
    minLength: [10, "Description must contains at least 10 character"],
  },
  type: { type: String },
  duration: {
    type: Number,
    min: [0, "Duration should have minimun at 0 second"],
  },
  date: { type: Date },
});

const ActivityRecordModel = mongoose.model("ActivityRecord", actRecordSchema);

module.exports = ActivityRecordModel;
