import React, { useState, useEffect } from "react";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Exam from "./Exam";
import Results from "./Results";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [page, setPage] = useState("login");

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace("#/", "");

      const savedQuestions = localStorage.getItem("exam_questions");
      const savedAnswers = localStorage.getItem("exam_answers");
      const savedTime = localStorage.getItem("exam_timeLeft");

      // Exam in progress → return to exam page
      if (savedQuestions && savedAnswers && savedTime && hash !== "exam" && hash !== "results") {
        hash = "exam";
        window.location.hash = "#/exam";
      }

      // ✅ Allow staying on results page after refresh
      if (hash === "results") {
        setPage("results");
        return;
      }

      if (hash) {
        setPage(hash);
      } else {
        setPage(token ? "dashboard" : "login");
        window.location.hash = token ? "#/dashboard" : "#/login";
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on first load
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [token]);

  const handleAuth = (newToken, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
    window.location.hash = "#/dashboard";
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    setUserId("");
    window.location.hash = "#/login";
  };

  if (!token) return <Auth onAuth={handleAuth} />;

  switch (page) {
    case "dashboard":
      return <Dashboard onLogout={handleLogout} />;
    case "exam":
      return <Exam token={token} />;
    case "results":
      return <Results token={token} />;
    default:
      window.location.hash = "#/dashboard";
      return null;
  }
}

export default App;
