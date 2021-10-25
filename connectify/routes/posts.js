const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// CREATE POST
router.post("/create", async (req, res) => {
  try {
    const createPost = new Post(req.body);
    await createPost.save();
    if (createPost) {
      res.status(200).json(createPost);
    } else {
      res.status(403).json({ err: "Post Not Created" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE POST
router.patch("/:id/update", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  const post = await Post.findById(postId);
  if (post.userId === userId) {
    try {
      await post.updateOne({ $set: req.body });
      return res.status(200).json({ msg: "The Post has been updated." });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ err: "You can update only your post" });
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId === req.body.userId) {
        try {
          await post.deleteOne();
          res.status(200).json({ msg: "Post Deleted Successfully" });
        } catch (error) {
          res.status(500).json({ err: "You can delete only your post" });
        }
      }
    } else {
      res.status(403).json({ err: "Post Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// LIKE/DISLIKE POST
router.patch("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      await res.status(200).json({ msg: "Post Liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ msg: "Post Disliked" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GETPOST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL POSTS of any Particular User
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    console.log(friendPosts);
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
