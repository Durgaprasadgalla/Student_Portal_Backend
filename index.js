// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import examRoutes from "./routes/exam.js";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: "https://Durgaprasadgalla.github.io",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

// // DB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error("MongoDB connection error:", err));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/exam", examRoutes);

// app.get("/", (req, res) => res.send("API is running..."));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import examRoutes from "./routes/exam.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Dynamic CORS — allows localhost and GitHub Pages
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://Durgaprasadgalla.github.io",
      "https://bright-boba-c637cb.netlify.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Root
app.get("/", (req, res) => res.send("API is running..."));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


