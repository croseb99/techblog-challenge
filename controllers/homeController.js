const express = require("express");
const router = express.Router();
const { Post } = require("../models");

// Render the homepage with all blog posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["created_at", "DESC"]], // Show posts in descending order of creation
      include: [{ model: User, attributes: ["username"] }], // Include username of the author
    });

    const postsData = posts.map((post) => post.get({ plain: true }));
    res.render("home", { posts: postsData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
