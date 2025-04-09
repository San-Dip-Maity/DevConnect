import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}blogs`, {
          params: { page: currentPage, limit: 6 },
        });
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold mb-3 text-green-400">
          Welcome to DevConnect
        </h1>
        <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
          A hub for developers to connect, share projects and write blogs
        </p>
        {!isAuthenticated ? (
          <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-lg transition"
        >
          Join Now
        </Link>
        ) : (
          <Link
          to="/dashboard"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-lg transition"
        >
          Dashboard
        </Link>
        )}
      </div>

      {/* Blogs Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Users className="text-green-400" /> Recent Blogs
        </h2>

        {loading ? (
          <div className="text-center py-8 text-green-300">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-green-500/40 transition"
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold mb-2 text-green-300">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {blog.user?.avatar && (
                      <img
                        src={blog.user.avatar}
                        alt={blog.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <p className="text-sm text-gray-400">
                      By {blog.user?.name}
                    </p>
                  </div>
                  <p className="text-gray-300 line-clamp-3">
                    {blog.content.replace(/<[^>]+>/g, "")}
                  </p>
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-green-400 mt-3 inline-block hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-full flex items-center gap-1 transition ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <ChevronLeft size={18} />
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    currentPage === index + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-full flex items-center gap-1 transition ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
