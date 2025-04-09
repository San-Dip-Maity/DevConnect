import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus } from "lucide-react";

const EditBlog = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}blogs/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { title, content, tags } = res.data;
        setForm({ title, content, tags: tags.join(", ") });
      } catch (err) {
        console.error("Failed to load blog", err);
      }
    };
    fetchBlog();
  }, [id]);

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
    blogData.append(
      "tags",
      JSON.stringify(form.tags.split(",").map((tag) => tag.trim()))
    );
    if (image) blogData.append("image", image);

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URI}blogs/${id}`,
        blogData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update blog", err);
      setError(err.response?.data?.msg || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Blog
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {loading && <p className="text-blue-500 text-sm mb-4">Updating...</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Blog Content
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ImagePlus className="w-5 h-5 text-blue-500" />
            <span>Upload New Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full cursor-pointer rounded-xl text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-xl border border-gray-300 dark:border-gray-600 shadow"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;