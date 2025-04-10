import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ThumbsUp,
  MessageCircle,
  CalendarDays,
  User,
  PencilLine,
  Send,
  MessageSquareText,
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const currentUserId = user?._id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}blogs/${id}`
        );
        setBlog(res.data);
      } catch (err) {
        console.error("Error loading blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}blogs/${id}/comment`,
          {
            withCredentials: true,
          }
        );
        setComments(res.data);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };
    if (blog) fetchComments();
  }, [blog, comments]);

  useEffect(() => {
    if (blog && user) {
      setLikes(blog.likes?.length || 0);
      setLiked(blog.likes?.includes(user._id));
    }
  }, [blog, user]);

  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}blogs/${id}/like`,
        {},
        { withCredentials: true }
      );
      setLikes(res.data.likes.length);
      setLiked(res.data.likes.includes(currentUserId));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}blogs/${id}/comment`,
        { comment: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (!blog)
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg transition">
      <h1 className="text-4xl font-extrabold mb-4 text-green-700 dark:text-green-400 flex items-center gap-3">
        <PencilLine size={28} /> {blog.title}
      </h1>

      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <User size={18} /> {blog.user?.name || "Anonymous"}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-xl mb-6 border border-gray-300 dark:border-gray-700"
        />
      )}

      <div
        className="prose prose-lg max-w-none dark:prose-invert leading-relaxed mb-10"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition text-white ${
            liked
              ? "bg-blue-800 hover:bg-blue-900"
              : "bg-blue-400 hover:bg-blue-700"
          }`}
        >
          <ThumbsUp size={18} /> Like 
        </button>
        <span className="text-gray-600 dark:text-gray-400">
          {likes} {likes === 1 ? "Like" : "Likes"}
        </span>
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle size={22} /> Comments
        </h3>

        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <Send size={16} /> Post
          </button>
        </form>

        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c._id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>{c.user?.name || "User"}</strong> •{" "}
                  {new Date(c.date).toLocaleString()}
                </p>
                <p className="text-gray-800 dark:text-gray-200">{c.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No comments yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
