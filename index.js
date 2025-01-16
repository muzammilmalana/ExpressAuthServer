const express = require("express");
const cors = require("cors");
require("@dotenvx/dotenvx").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/db/dbConnection");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", authRoutes);

const SERVER_PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
