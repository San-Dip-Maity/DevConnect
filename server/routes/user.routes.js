const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { avatar } = require("../middleware/uploadMiddleware");
const {
  updateProfile,
  followUser,
  getFeed,
  getMe,
} = require("../controllers/user.controller");

router.get("/me", auth, getMe);
router.put("/update", auth, avatar.single("avatar"), updateProfile);
router.put("/follow/:id", auth, followUser);
router.get("/feed", auth, getFeed);

module.exports = router;
