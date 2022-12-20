const express = require("express");
const router = express.Router();

// @routes GET api/auth
// @des    auth route
// @access Public

router.get("/", (req, res) => {
  res.json("auth");
});

module.exports = router;
