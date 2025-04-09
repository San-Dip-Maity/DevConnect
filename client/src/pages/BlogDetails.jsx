import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error loading blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-600 text-sm mb-4">
        By {blog.user?.name} • {new Date(blog.createdAt).toLocaleDateString()}
      </div>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      
      {/* Optional: add actions */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Bookmark</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Comment</button>
      </div>
    </div>
  );
};

export default BlogDetails;
