import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      questionId: { type: String, required: true },
      selectedOption: { type: Number, default: null }
    }
  ],
  score: Number,
  taken: Boolean,
  review: [
    {
      question: String,
      correct: String,
      selected: String
    }
  ]
});

export default mongoose.model("Result", ResultSchema);
