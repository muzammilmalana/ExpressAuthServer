const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const JWT_AGE = 60 * 60 * 24 * 1;

const errorHandler = (error) => {
  let errors = { email: "", password: "" };

  if (error.message.includes("Invalid Username or Password!")) {
    errors.email = "Invalid Username or Password!";
    errors.password = "Invalid Username or Password!";
    return errors;
  }

  if (error.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const create_JWT_Token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: JWT_AGE });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // throw Error("Email is not registered!");
      throw Error("Invalid Username or Password!"); //guess what?
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw Error("Invalid Username or Password!");
    }

    const token = create_JWT_Token(user._id);
    res.cookie("JWT", token, { httpOnly: true, maxAge: JWT_AGE * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = create_JWT_Token(user._id);
    res.cookie("JWT", token, { httpOnly: true, maxAge: JWT_AGE * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const logout = (req, res) => {
  // logout logic --> clear cookie
};

module.exports = {
  login,
  register,
  logout,
};
