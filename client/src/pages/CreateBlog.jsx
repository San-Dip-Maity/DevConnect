import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ImagePlus,
  LoaderCircle,
  FileText,
  Tags,
  Heading1,
  PencilLine,
} from "lucide-react";

const CreateBlog = () => {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (image && image.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      setLoading(false);
      return;
    }

    const blogData = new FormData();
    blogData.append("title", form.title);
    blogData.append("content", form.content);
    blogData.append("tags", form.tags);
    if (image) blogData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}blogs`,
        blogData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Blog creation error:", err);
      setError(err.response?.data?.msg || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6">
      <div className="flex items-center gap-3">
        <PencilLine className="w-8 h-8 text-green-600" />
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          New Blog Post
        </h2>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <LoaderCircle className="animate-spin" />
          Submitting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Heading1 className="w-5 h-5" />
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-5 h-5" />
            Blog Content
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
          ></textarea>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Tags className="w-5 h-5" />
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ImagePlus className="w-5 h-5 text-green-500" />
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full cursor-pointer rounded-lg text-sm bg-gray-100 dark:bg-gray-800 dark:text-white p-3 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          {image && (
            <div className="mt-4 transition-all duration-300">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border border-gray-300 dark:border-gray-600 shadow-md"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-[1.02] shadow"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
