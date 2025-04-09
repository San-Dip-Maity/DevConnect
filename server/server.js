const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const projectRoutes = require("./routes/project.routes")
const blogRoutes = require("./routes/blog.routes")

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URI,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
