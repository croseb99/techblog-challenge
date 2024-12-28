const express = require("express");
const router = express.Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth"); // Custom middleware to check if user is logged in

// View an individual post with its comments
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username"] },
        { model: Comment, include: [User] },
      ],
    });

    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    const postData = post.get({ plain: true });
    res.render("post", { post: postData });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a new post
router.post("/post", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Edit an existing post
router.put("/post/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id, // Ensure only the post owner can edit
        },
      }
    );

    if (!updatedPost) {
      res
        .status(404)
        .send("Post not found or you do not have permission to edit");
      return;
    }

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a post
router.delete("/post/:id", withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id, // Ensure only the post owner can delete
      },
    });

    if (!deletedPost) {
      res
        .status(404)
        .send("Post not found or you do not have permission to delete");
      return;
    }

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Add a comment to a post
router.post("/post/:id/comment", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
