const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access denied");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userData.userId;
    req.roleId = decoded.userData.roleId;
    next();
  } catch (error) {
    return res.status(403).send("Forbidden");
  }
};

module.exports = verifyJWT;
