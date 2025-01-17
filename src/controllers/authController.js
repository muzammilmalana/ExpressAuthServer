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
const create_Refresh_Token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
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

    const accessToken = create_JWT_Token(user._id);
    const refreshToken = create_Refresh_Token(user._id);
    res.cookie("JWT", accessToken, { httpOnly: true, maxAge: JWT_AGE * 1000 });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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
  res.cookie("JWT", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });
  res.status(200).send("Logged out!");
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not found" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = create_JWT_Token(decoded.id);
    res.cookie("JWT", newAccessToken, {
      httpOnly: true,
      maxAge: JWT_AGE * 1000,
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};

module.exports = {
  login,
  register,
  logout,
  refreshAccessToken,
};
