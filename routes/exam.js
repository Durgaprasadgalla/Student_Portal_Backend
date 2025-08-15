import express from "express";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all questions (no correct answers sent)
router.get("/questions", verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({}, { question: 1, options: 1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// CHECK exam status
router.get("/status", verifyToken, async (req, res) => {
  const existing = await Result.findOne({ user: req.user.id });
  res.json({ taken: !!existing });
});

// SUBMIT exam
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedOption }]
    if (!Array.isArray(answers))
      return res.status(400).json({ message: "Invalid answers" });

    let score = 0;
    const review = [];

    for (let ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (!q) continue;

      const correctText = q.options[q.answer];
      const selectedText =
        ans.selectedOption !== null && ans.selectedOption !== undefined
          ? q.options[ans.selectedOption]
          : "Not answered";

      if (ans.selectedOption === q.answer) score++;

      review.push({
        question: q.question,
        correct: correctText,
        selected: selectedText
      });
    }

    await Result.create({
      user: req.user.id,
      answers,
      score,
      taken: true,
      review
    });

    res.json({ score, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit exam" });
  }
});

// GET result
router.get("/result", verifyToken, async (req, res) => {
  const result = await Result.findOne({ user: req.user.id });
  if (!result) return res.status(404).json({ message: "No result found" });
  res.json({ score: result.score, review: result.review });
});

export default router;

