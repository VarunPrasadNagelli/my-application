const express = require("express");
const router = express.Router();
const user = require("../../middleware/auth");
const Users = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// @routes GET api/auth
// @des    auth route
// @access Public

router.get("/", user, async (req, res) => {
  try {
    const user = await Users.findById(req.users.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @routes POST api/auth
// @des    register user
// @access Public

router.post(
  "/",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    //validating user information
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
    }

    try {
      const { email, password } = req.body;

      //check if user exists in the database
      let user = await Users.findOne({ email });
      if (!user) {
        res.status(400).json({ error: [{ msg: "invalid credentials" }] });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(400).json({ error: [{ msg: "invalid credentials" }] });
      }

      // add payload to get json web token
      const payload = {
        users: {
          id: user.id,
        },
      };

      // sign in to get jwt
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600000000 },
        (error, token) => {
          if (error) throw error;
          res.json(token);
        }
      );
    } catch (error) {
      //   res.status(500).json(error.message);
    }
  }
);

module.exports = router;
