import express from "express";
import User from "../models/User.js";

export const router = express.Router();

//  GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    res.json(users); // send response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  POST new user (optional, to add users from Postman)
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router:
