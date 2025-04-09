import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}blogs?limit=6`);
        console.log(res.data)
        setBlogs(res.data.blogs || res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to DevConnect</h1>
        <p className="text-gray-600 text-lg mb-4">
          A hub for developers to connect, share projects and write blogs
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700"
        >
          Join Now
        </Link>
      </div>

      {/* Recent Blogs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">By {blog.user?.name}</p>
              <p className="text-gray-700 line-clamp-3">
                {blog.content.replace(/<[^>]+>/g, "")}
              </p>
              <Link
                to={`/blogs/${blog._id}`}
                className="text-blue-600 mt-2 inline-block"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
