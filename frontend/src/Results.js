import React, { useEffect, useState } from 'react';
import { getResult } from './api';
import './Results.css';

function Results({ token }) {
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!token) return;
    getResult(token)
      .then(r => setResult(r.data))
      .catch(err => console.error("Error fetching result:", err));
  }, [token]);

  if (!result) return <div>Loading result...</div>;

  const review = result.review || [];
  const total = review.length;

  return (
    <div className="result-container">
      <h2>🎯 Exam Results</h2>
      <div>Your Score: {result.score} / {total}</div>

      {review[current] && (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
    {/* Question box */}
    <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
      <h3 className="text-lg font-semibold">
        {current + 1}. {review[current].question}
      </h3>
    </div>

    {/* Answer box */}
    <div className="space-y-3">
      <p className="border border-green-300 rounded-md p-3 bg-green-50">
        ✅ Correct Answer:{" "}
        <span className="font-semibold text-green-700">{review[current].correct}</span>
      </p>
      <p
        className={`border rounded-md p-3 ${
          review[current].selected === review[current].correct
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-red-300 bg-red-50 text-red-700"
        }`}
      >
        📝 Your Answer:{" "}
        <span className="font-semibold">
          {review[current].selected || "No Answer"}
        </span>
      </p>
    </div>
  </div>
)}


      <div className="nav-buttons">
        <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>Previous</button>
        <button disabled={current === total - 1} onClick={() => setCurrent(c => c + 1)}>Next</button>
      </div>

      <button
  onClick={() => {
    localStorage.removeItem("viewing_results"); // ✅ Clear flag
    window.location.href = "/#/dashboard";
  }}
>
  Return to Dashboard
</button>

    </div>
  );
}

export default Results;
