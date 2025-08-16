import express from "express";
import User from "../models/User.js"; // import your User model

export const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
