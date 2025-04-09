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
        console.log(res.data);
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
        console.log(response.data.blogs);
        setBlogs(response.data.blogs);
        return response.data;
      } catch (err) {
        console.error("Error fetching user blogs:", err);
        throw err;
      }
    };

    fetchUserBlogs();
  }, [user]);


  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <Link
          to="/create-blog"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Blog
        </Link>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Your Blogs</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="border rounded p-4">
                <h4 className="font-bold text-lg">{blog.title}</h4>
                <div className="flex gap-3 mt-2">
                  <Link to={`/blogs/${blog._id}`} className="text-blue-600">
                    View
                  </Link>
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="text-yellow-600"
                  >
                    Edit
                  </Link>
                  {/* You can add delete handler here */}
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
