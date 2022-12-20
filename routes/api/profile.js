const express = require("express");
const router = express.Router();

// @routes GET api/profile
// @des    test route
// @access Public

router.get("/", (req, res) => {
  res.json("profile");
});

module.exports = router;
