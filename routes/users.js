// routes/users.js
import express from "express";
const router = express.Router();

// example route
router.get("/", (req, res) => {
  res.send("User route working");
});

export default router;   // 👈 this is important
