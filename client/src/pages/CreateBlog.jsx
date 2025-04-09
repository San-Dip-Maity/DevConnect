import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });
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

    // Validate image size
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

      console.log("Blog creation response:", response.data);

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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {loading && <p className="text-blue-500 mb-4 text-sm">Submitting...</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          className="input"
          required
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          value={form.content}
          onChange={handleChange}
          className="input h-40"
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
          className="input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
