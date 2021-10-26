const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE USER (ANY FIELD)
router.patch("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      const hashPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPass;
    }
    try {
      const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({ msg: "Account has been Updated" });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    return res
      .status(400)
      .json({ msg: "Error Fetching UserID or User is not an Admin" });
  }
});

// DELETE A USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const delUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "User Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ msg: "You Can Delete Only Your Account" });
  }
});

// GET A USER
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const getUser = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, createdAt, ...other } = getUser._doc;
    if (getUser) {
      res.status(200).json(other);
    } else {
      res.status(400).json({ msg: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Friends
router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePic } = friend;
      friendList.push({ _id, username, profilePic });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// FOLLOW A USER
router.patch("/:id/follow", async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const toFollowUser = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (!toFollowUser.followers.includes(userId)) {
        await toFollowUser.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({ msg: "user has been followed" });
      } else {
        res.status(403).json({ msg: "You are already following that user" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ msg: "You Can't Follow Yourself" });
  }
});

// UNFOLLOW A USER
router.patch("/:id/unfollow", async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const toUnfollowUser = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (!toUnfollowUser.followers.includes(userId)) {
        res.status(403).json({ msg: "You are not following that user" });
      } else {
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        await toUnfollowUser.updateOne({ $pull: { followers: userId } });
        res.status(200).json({ msg: "User Unfollowed Successfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({ msg: "You Can't Unfollow Yourself" });
  }
});
module.exports = router;
