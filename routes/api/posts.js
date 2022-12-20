const express = require("express");
const router = express.Router();

// @routes GET api/posts
// @des    test route
// @access Public

router.get("/", (req, res) => {
  res.json("posts");
});

module.exports = router;
