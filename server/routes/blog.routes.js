const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { blog } = require("../middleware/uploadMiddleware");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentOnBlog,
  getBlogsByUserId,
  getBlogComments,
} = require("../controllers/blog.controller");

router.get("/user/:userId", getBlogsByUserId);
router.post("/", auth, blog.single("image"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", auth, blog.single("image"), updateBlog);
router.delete("/:id", auth, deleteBlog);
router.put("/:id/like", auth, likeBlog);
router.post("/:id/comment", auth, commentOnBlog);
router.get("/:id/comment", auth, getBlogComments);

module.exports = router;
