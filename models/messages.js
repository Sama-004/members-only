const mongoose = require("mongoose");
const User = require("./users");

const Schema = mongoose.Schema;

// Define the schema for the message
const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  timestamp: {
    // type: Date,
    type: String,
    // default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

// Create and export the Message model
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
