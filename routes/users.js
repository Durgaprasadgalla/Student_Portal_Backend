const express = require("express");
const router = express.Router();

// Example GET users route
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // MongoDB query
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
