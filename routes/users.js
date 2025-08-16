import express from "express";
import bcrypt from "bcrypt";
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
