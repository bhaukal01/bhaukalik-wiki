import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

function requireAuth(navigate) {
  if (!localStorage.getItem("token")) {
    navigate("/wiki-admin");
    return false;
  }
  return true;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!requireAuth(navigate)) return;
    fetchArticles();
    // eslint-disable-next-line
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/wiki-admin");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axios.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-7 gap-4">
        <h1 className="text-3xl font-extrabold text-[#2563eb] tracking-tight">
          Admin Dashboard
        </h1>
        <div className="flex gap-2">
          <Link
            to="/wiki-admin/add"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#22c55e] to-[#059669] text-white font-semibold shadow hover:opacity-90 transition"
          >
            Add New
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/85 dark:bg-[#232a3b]/90 backdrop-blur-lg border border-[#2563eb]/20">
        <table className="min-w-full divide-y divide-[#e7ecfa] dark:divide-[#25365c]/20">
          <thead className="bg-white/70 dark:bg-[#232a3b]/80 text-[#2563eb]">
            <tr>
              <th className="text-left px-5 py-4 font-bold uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-5 py-4 font-bold uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-5 py-4 font-bold uppercase tracking-wider">
                Tags
              </th>
              <th className="text-left px-5 py-4 font-bold uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-5 py-4 font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr
                key={a._id}
                className="border-t border-[#2563eb]/10 hover:bg-[#2563eb]/10 transition"
              >
                <td className="px-5 py-4 font-semibold text-gray-900 dark:text-[#c4dafb]">
                  {a.title}
                </td>
                <td className="px-5 py-4 text-[#2563eb] dark:text-[#38bdf8] font-medium">
                  {a.category}
                </td>
                <td className="px-5 py-4 text-gray-800 dark:text-[#a3aed6]">
                  {(a.tags || []).join(", ")}
                </td>
                <td className="px-5 py-4 text-gray-500 dark:text-[#b8c6de]">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-4 flex gap-3">
                  <Link
                    to={`/wiki-admin/edit/${a._id}`}
                    className="font-semibold text-[#2563eb] hover:text-[#38bdf8] underline underline-offset-2 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="font-semibold text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan={5}>
                  No articles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
