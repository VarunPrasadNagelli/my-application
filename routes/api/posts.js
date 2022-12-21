const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Users = require("../../models/Users");
const Posts = require("../../models/Posts");
// @routes post api/posts
// @des    test route
// @access Public

router.post("/", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.users.id).select("-password");
    const newPost = new Posts({
      users: req.users.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// @routes get api/posts
// @des    test route
// @access Public

router.get("/", auth, async (req, res) => {
  try {
    const post = await Posts.find().sort({ date: -1 });
    res.json(post);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// @routes get api/posts:id
// @des    test route
// @access Public

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

module.exports = router;

// @routes delete api/posts:id
// @des    test route
// @access Public

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.users.toString() === req.users.id) {
      await Posts.deleteOne({ _id: req.params.id });
      res.json("deleted");
    } else {
      res.json({ msg: "not authorised to delete" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// @routes put api/posts/like/:id
// @des    test route
// @access Public

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.users.id)
        .length > 0
    ) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.users.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      res.json({ msg: "post unliked" });
    } else {
      post.likes.unshift({ user: req.users.id });
      await post.save();
      res.json({ msg: "post liked" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// @routes post api/posts/comment/:id
// @des    test route
// @access Public

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.users.id).select("-password");
    const post = await Posts.findById(req.params.id);
    const newComment = {
      users: req.users.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.users.toString() !== req.users.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
