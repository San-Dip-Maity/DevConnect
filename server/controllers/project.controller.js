const Project = require("../models/Project.model");
const UserModel = require("../models/User.model");

exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveDemoUrl } = req.body;

    if (!title || !description || !techStack) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const images = req.files?.map((file) => file.path) || [];

    const project = new Project({
      user: req.user,
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [techStack],
      githubUrl,
      liveDemoUrl,
      images,
    });

    await project.save();

    await UserModel.findByIdAndUpdate(
      req.user,
      { $push: { projects: project._id } },
      { new: true }
    );

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
