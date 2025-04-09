import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}user/me`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}blogs/user/${user._id}`,
          {
            params: {
              page: 1,
              limit: 10,
            },
          }
        );
        setBlogs(response.data.blogs);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
      }
    };

    fetchUserBlogs();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* User Info Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
        <Link
          to="/create-blog"
          className="inline-block mt-4 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition"
        >
          + Create Blog
        </Link>
      </div>

      {/* Blog List Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Your Blogs
        </h3>

        {blogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-lg transition"
              >
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-4">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="text-yellow-500 hover:underline"
                  >
                    Edit
                  </Link>
                  {/* Optionally: Add delete button here */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
