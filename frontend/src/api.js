import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

// Auth APIs
export const register = (username, password) =>
  axios.post(`${BASE_URL}/auth/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${BASE_URL}/auth/login`, { username, password });

// Exam APIs
export const getQuestions = (token) =>
  axios.get(`${BASE_URL}/exam/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const submitExam = (answers, token) =>
  axios.post(`${BASE_URL}/exam/submit`, { answers }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getResult = (token) =>
  axios.get(`${BASE_URL}/exam/result`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getStatus = (token) =>
  axios.get(`${BASE_URL}/exam/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
