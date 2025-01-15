const mongoose = require("mongoose");
const { isEmail } = require("validator");

// Schema to define the structure
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    lowercase: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email address!"],
  },
  password: {
    type: String,
    minlength: [6, "Minimum Length for a password is 6 digits"],
    required: [true, "Please provide a password"],
  },
});

// model based on the schema
const User = mongoose.model("user", userSchema);

module.exports = User;
