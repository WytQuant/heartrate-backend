const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_is_verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  activityRecords: { type: Array, default: [] },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
