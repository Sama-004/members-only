const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
  //   is_member: { type: Boolean },
  //   is_admin: { type: Boolean },
});

// Virtual for Users URL
userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("user", userSchema);
