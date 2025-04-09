const BlogModel = require("../models/Blog.model");
const Blog = require("../models/Blog.model");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const blog = new Blog({
      user: req.user,
      title,
      content,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      image,
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error("Blog creation error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const tag = req.query.tag;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = tag ? { tags: tag } : {};

    const blogs = await Blog.find(filter)
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.user.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const alreadyLiked = blog.likes.includes(req.user);
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((uid) => uid.toString() !== req.user);
    } else {
      blog.likes.push(req.user);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.commentOnBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.comments.push({
      user: req.user,
      comment: req.body.comment,
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.user.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Handle image upload if present
    if (req.file) {
      blog.image = req.file.path;
    }

    // Parse tags if they're sent as a string
    let tags = [];
    if (typeof req.body.tags === "string") {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        tags = req.body.tags.split(",").map((tag) => tag.trim());
      }
    }

    // Update blog fields
    const updates = {
      title: req.body.title,
      content: req.body.content,
      tags: tags,
      ...(req.file && { image: req.file.path }),
    };

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        blog[key] = updates[key];
      }
    });

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    console.error("Blog update error:", err);
    res.status(500).json({ msg: "Error updating blog" });
  }
};

exports.getBlogsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await BlogModel.find({ user: userId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Blog.countDocuments({ user: userId });

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (err) {
    console.error("Get user blogs error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
