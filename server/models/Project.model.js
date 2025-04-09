const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  techStack: [String],
  githubUrl: String,
  liveDemoUrl: String,
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
