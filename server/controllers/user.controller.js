const BlogModel = require("../models/Blog.model");
const User = require("../models/User.model");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .select('-password')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    // Populate projects if the field exists
    if (user.projects) {
      await user.populate({
        path: 'projects',
        select: 'title description images createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
      skills: req.body.skills,
      github: req.body.github,
      portfolio: req.body.portfolio,
    };

    if (req.file) {
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user, updates, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const targetId = req.params.id;

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      user.following = user.following.filter(id => id.toString() !== targetId);
    } else {
      user.following.push(targetId);
    }

    await user.save();
    res.json({ following: user.following });
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error");
  }
};

exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const blogs = await BlogModel.find({ user: { $in: user.following } })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error");
  }
};

