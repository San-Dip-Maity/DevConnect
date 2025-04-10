import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  List,
  Code2,
  Github,
  Link2,
  ImagePlus,
  AlertTriangle,
} from "lucide-react";

const CreateProject = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    projectLink: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      data.append(key, form[key]);
    }
    if (image) data.append("image", image);

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URI}projects`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Project creation failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Add New Project</h2>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="flex items-center gap-3">
          <FileText className="text-green-400" />
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none border-2 border-gray-600 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex items-start gap-3">
          <List className="mt-3 text-green-400" />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border-2 border-gray-600 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Tech Stack */}
        <div className="flex items-center gap-3">
          <Code2 className="text-green-400" />
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack (comma-separated)"
            value={form.techStack}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* GitHub Link */}
        <div className="flex items-center gap-3">
          <Github className="text-green-400" />
          <input
            type="url"
            name="githubLink"
            placeholder="GitHub Link"
            value={form.githubLink}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Live Project Link */}
        <div className="flex items-center gap-3">
          <Link2 className="text-green-400" />
          <input
            type="url"
            name="projectLink"
            placeholder="Live Project Link (optional)"
            value={form.projectLink}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-3">
          <ImagePlus className="text-green-400" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300 "
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
