const express = require("express");
const cors = require("cors");
require("@dotenvx/dotenvx").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const connectDB = require("./src/db/dbConnection");
const { authMiddleware } = require("./src/middlewares/authMiddleware");

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const SERVER_PORT = process.env.PORT || 5000;

// db connection
connectDB()
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// routes
app.use("/auth", authRoutes);
app.use("/home", authMiddleware, homeRoutes);
