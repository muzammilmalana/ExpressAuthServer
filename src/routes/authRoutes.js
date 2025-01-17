const router = require("express").Router();

const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/logout", authController.logout);

router.post("/refresh-token", authController.refreshAccessToken);

module.exports = router;
