const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { blog } = require("../middleware/uploadMiddleware"); // Destructure to get blog uploader
const {
  createProject,
  getAllProjects,
  getUserProjects,
} = require("../controllers/project.controller");

router.post("/", auth, blog.array("images", 5), createProject);
router.get("/", getAllProjects);
router.get("/me", auth, getUserProjects);

module.exports = router;
