const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const Users = require("../../models/Users");

// @routes GET api/profile/me
// @des    get single profile
// @access Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ users: req.users.id }).populate(
      "users",
      ["name", "avatar"]
    );
    if (!profile) {
      res.status(500).json({ msg: "Profile does not exists" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// @routes GET api/profile/users/:user_id
// @des    get single profile
// @access Public

router.get("/users/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      users: req.params.user_id,
    }).populate("users", ["name", "avatar"]);
    if (!profile) {
      res.status(500).json({ msg: "Profile does not exists" });
    }
    res.json(profile);
  } catch (error) {
    // res.status(500).json({ error: "server error" });
  }
});

// @routes GET api/profile/
// @des    get all profile
// @access Public

router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("users", ["name", "avatar"]);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// @routes POST api/profile/
// @des    create and update profile
// @access Public

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "status is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
      }
      // destructure the request
      const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      const profileFields = {
        users: req.users.id,
        skills: skills,
        social: { youtube, twitter, instagram, linkedin, facebook },
        ...rest,
      };
      let profile = await Profile.findOne({ users: req.users.id });
      if (profile) {
        await Profile.findOneAndUpdate(
          { users: req.users.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      //   res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

// @routes Delete api/profile/
// @des    delete user
// @access Public

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ users: req.users.id });
    await Users.findOneAndRemove({ _id: req.users.id });
    res.json({ msg: "profile deleted" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// @routes PUT api/experience
// @des    update experience
// @access Public

router.put("/experience", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      users: req.users.id,
    });
    profile.experience.unshift(req.body);

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @routes Delete api/experience/:exp_id
// @des    delete experience
// @access Public

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ users: req.users.id });
    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @routes PUT api/education
// @des    update education
// @access Public

router.put("/education", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      users: req.users.id,
    });
    profile.education.unshift(req.body);

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @routes Delete api/education/:edu_id
// @des    delete education
// @access Public

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ users: req.users.id });
    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile.education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
