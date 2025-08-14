import React, { useState, useEffect } from "react";
import { getQuestions, submitExam, getResult } from "./api.js";
import "./Exam.css"

function Exam({ token }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  // Load state from localStorage
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("exam_questions"));
    const savedAnswers = JSON.parse(localStorage.getItem("exam_answers"));
    const savedCurrent = parseInt(localStorage.getItem("exam_current"));
    const savedTime = parseInt(localStorage.getItem("exam_timeLeft"));

    if (savedQuestions?.length) {
      setQuestions(savedQuestions);
      setAnswers(savedAnswers || Array(savedQuestions.length).fill(null));
      setCurrent(!isNaN(savedCurrent) ? savedCurrent : 0);
      setTimeLeft(!isNaN(savedTime) ? savedTime : 30 * 60);
    } else {
      fetchQuestions();
    }
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions(token);
      setQuestions(res.data);
      setAnswers(Array(res.data.length).fill(null));
      localStorage.setItem("exam_questions", JSON.stringify(res.data));
      localStorage.setItem("exam_answers", JSON.stringify(Array(res.data.length).fill(null)));
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  // Timer
  useEffect(() => {
    if (!questions.length || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, questions.length, submitted]);

  // Save state on changes
  useEffect(() => {
    localStorage.setItem("exam_current", current);
    localStorage.setItem("exam_answers", JSON.stringify(answers));
    localStorage.setItem("exam_timeLeft", timeLeft);
  }, [current, answers, timeLeft]);

  const handleOption = (idx) => {
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    const payload = questions.map((q, i) => ({
      questionId: q._id,
      selectedOption: answers[i],
    }));

    try {
      await submitExam(payload, token);
      setSubmitted(true);

      // Clear localStorage
      localStorage.removeItem("exam_questions");
      localStorage.removeItem("exam_answers");
      localStorage.removeItem("exam_current");
      localStorage.removeItem("exam_timeLeft");

      const r = await getResult(token);
      setResult(r.data);
      window.location.href = "/#/results";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting exam");
    }
  };

  if (!questions.length) return <div className="exam-container">Loading questions...</div>;

  if (submitted && result)
    return (
      <div className="exam-container">
        <h2>Exam Submitted</h2>
        <div>
          Score: {result.score} / {result.review?.length || 0}
        </div>
        <button onClick={() => (window.location.hash = "#/dashboard")}>Return to Dashboard</button>
      </div>
    );

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="exam-container">
      <div style={{ textAlign: "right", color: "#d32f2f", fontWeight: 600 }}>
        Time Left: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      <h3>
        Question {current + 1} of {questions.length}
      </h3>
      <div>{q.question}</div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {q.options.map((opt, idx) => (
          <li
            key={idx}
            onClick={() => handleOption(idx)}
            style={{
              padding: "8px",
              margin: "6px 0",
              border: answers[current] === idx ? "2px solid #1976d2" : "2px solid #ccc",
              borderRadius: 6,
              backgroundColor: answers[current] === idx ? "#e3f2fd" : "#fff",
              cursor: "pointer",
            }}
          >
            {String.fromCharCode(65 + idx)}. {opt}
          </li>
        ))}
      </ul>
      <div className="exam-actions buttons">
        <button disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button>
        <button disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)}>Next</button>
        <button onClick={handleSubmit}>Submit Exam</button>
      </div>
    </div>
  );
}

export default Exam;
