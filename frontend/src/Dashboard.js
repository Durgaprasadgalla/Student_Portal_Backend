// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const username = localStorage.getItem("username") || "Student";
  const token = localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/exam/status", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSubmitted(res.data.taken))
        .catch((err) => console.error("Error fetching exam status:", err));
    }
  }, [token]);

  const handleBeginExam = () => {
    window.location.href = "/#/exam";
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <span className="dashboard-title">Exam Portal</span>
        <div className="dashboard-user">
          <span className="dashboard-username">{username}</span>
          <button className="dashboard-signout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2 className="dashboard-username">Welcome, {username}!</h2>
        <p className="dashboard-subtitle">Get ready for your upcoming exam</p>

        <div className="card exam-details">
          <h3>📋 Exam Details</h3>
          <p><strong>Duration:</strong> 30 minutes</p>
          <p><strong>Questions:</strong> 30 multiple-choice</p>
          <p><strong>Submission:</strong> One-time only</p>
        </div>

        <div className="card exam-instructions">
          <h3>📝 Instructions</h3>
          <ul>
            <li>Read each question carefully before answering.</li>
            <li>Select only one answer per question.</li>
            <li>Use Next/Previous buttons to navigate.</li>
            <li>Submit your answers before time runs out.</li>
            <li>Do not refresh or close the tab during the exam.</li>
          </ul>
        </div>

        {!submitted ? (
          <button className="primary-btn" onClick={handleBeginExam}>
            Begin Exam
          </button>
        ) : (
          <button
            className="success-btn"
            onClick={() => (window.location.hash = "#/results")}
          >
            View Results
          </button>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          // padding: "10px",
          background: "#f8f9fa",
          borderTop: "1px solid #ddd",
          // marginBottom: "20px",
          fontFamily:"arial,sans-serif",
        }}
      >
        © {new Date().getFullYear()} Dp. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
