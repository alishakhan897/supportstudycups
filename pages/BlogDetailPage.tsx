import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `https://studycupsbackend-wb8p.onrender.com/api/blogs/${id}`
        );
        const json = await res.json();
        setBlog(json.data);
      } catch (err) {
        console.error("Blog fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center py-32">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <div className="text-center py-32">
        <h2 className="text-xl font-bold">Blog not found</h2>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* BACK */}
        <button
          onClick={() => navigate("/blog")}
          className="text-sm text-blue-600 font-semibold mb-6"
        >
          ← Back to Blogs
        </button>

        {/* IMAGE */}
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-[420px] object-cover rounded-2xl shadow"
        />

        {/* META */}
        <div className="mt-6">
          <span className="text-xs font-semibold text-blue-600">
            {blog.category}
          </span>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            {blog.title}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            By {blog.author} •{" "}
            {new Date(blog.date || blog.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
        </div>

      </div>
    </div>
  );
};

export default BlogDetailPage;
