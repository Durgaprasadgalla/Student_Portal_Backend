import express from "express";
import bcrypt from "bcryptjs";
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

    // check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user with hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});


export default router;
