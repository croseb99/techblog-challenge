const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const withAuth = require("../utils/auth"); // Custom middleware to check if user is logged in

// Get the user's dashboard with their posts
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: req.session.user_id }, // Filter posts by the logged-in user
      order: [["created_at", "DESC"]],
    });

    const postsData = posts.map((post) => post.get({ plain: true }));
    res.render("dashboard", { posts: postsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to create a new post
router.get("/dashboard/new", withAuth, (req, res) => {
  res.render("newPost");
});

// Route to edit an existing post
router.get("/dashboard/edit/:id", withAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const postData = post.get({ plain: true });
    res.render("editPost", { post: postData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
