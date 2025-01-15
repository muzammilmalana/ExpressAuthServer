const User = require("../models/User");

const errorHandler = (error) => {
  let errors = { email: "", password: "" };
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //   const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

const logout = (req, res) => {
  res.send("Logout API is running");
};

module.exports = {
  login,
  register,
  logout,
};
