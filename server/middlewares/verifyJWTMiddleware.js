const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).send("Access denied");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded.userData;
    next();
  } catch (error) {
    return res.status(403).send("Forbidden");
  }
};

module.exports = verifyJWT;
