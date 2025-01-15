const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("@dotenvx/dotenvx").config();
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

const SERVER_PORT = process.env.PORT || 5000;

// convert into seperate file
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
