const express = require("express");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all journals for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId })
      .sort({ entryDateTime: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add journal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const journal = await Journal.create({
      userId: req.userId,
      entryDateTime: new Date(),
      content: req.body.content
    });
    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
