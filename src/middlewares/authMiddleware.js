const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.JWT;
  //check if it exists
  if (!token) {
    return res.status(401).json({ errors: { token: "Unauthorized!" } });
  }
  //verify the token since it exists
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      //redirect to login .. i guess!
      return res.status(401).json({ errors: { token: "Unauthorized!" } });
    } else {
      //perform some action with the decoded token?????
      //i dont think so
      // console.log(decodedToken);
      next();
    }
  });
};

module.exports = { authMiddleware };
