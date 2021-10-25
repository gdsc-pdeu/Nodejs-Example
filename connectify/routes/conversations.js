const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get conversation
router.get("/:userId", async (req, res) => {
  try {
    const fetchConversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(fetchConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
