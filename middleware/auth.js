const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../models/Users");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({ msg: "Not Authenticated" });
    next();
  } else {
    try {
      const decoded = jwt.verify(token, process.env.jwtSecret);
      req.users = decoded.users;
      next();
    } catch (error) {
      res.status(500).json({ msg: "Invalid token" });
    }
  }
}

module.exports = auth;
