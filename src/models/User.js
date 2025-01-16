const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

// hashing the password before the document is saved
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12);
  const user = this;
  user.password = await bcrypt.hash(user.password, salt);
  next();
});
// userSchema.pre  ("save", async function (next) {
//   const user = this;
//   if (!user.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   next();
// });

// userSchema.methods.validatePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

// model based on the schema
const User = mongoose.model("user", userSchema);

module.exports = User;
