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
    if (!confirm("Delete this article?")) return;
    try {
      await axios.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <Link
            to="/wiki-admin/add"
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Add New
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="px-3 py-2 border rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded bg-white dark:bg-gray-800">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Tags</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-4 py-3">{a.title}</td>
                <td className="px-4 py-3">{a.category}</td>
                <td className="px-4 py-3">{(a.tags || []).join(", ")}</td>
                <td className="px-4 py-3">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/wiki-admin/edit/${a._id}`}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td className="p-4" colSpan={5}>
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
