import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [sort, setSort] = useState("newest");

  const fetchArticles = async () => {
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (category) q.set("category", category);
      if (tag) q.set("tag", tag);
      const res = await axios.get(`/articles?${q.toString()}`);
      const data = res.data;
      setArticles(data);
      // extract categories & tags for sidebar
      const cats = Array.from(
        new Set(data.map((a) => a.category).filter(Boolean))
      );
      setCategories(cats);
      const allTags = Array.from(new Set(data.flatMap((a) => a.tags || [])));
      setTags(allTags);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, category, tag, sort]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="flex items-center gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, tags, content..."
            className="flex-1 border px-3 py-2 rounded"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="grid gap-4">
          {articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            articles
              .slice()
              .sort((a, b) =>
                sort === "newest"
                  ? new Date(b.createdAt) - new Date(a.createdAt)
                  : new Date(a.createdAt) - new Date(b.createdAt)
              )
              .map((a) => <ArticleCard key={a._id} article={a} />)
          )}
        </div>
      </div>

      <aside className="lg:col-span-1 space-y-4">
        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                onClick={() => setCategory("")}
                className={`w-full text-left ${
                  category === "" ? "font-semibold" : ""
                }`}
              >
                All
              </button>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setCategory(c)}
                  className={`w-full text-left ${
                    category === c ? "font-semibold" : ""
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTag("")}
              className={`px-2 py-1 rounded border ${
                tag === "" ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-2 py-1 rounded border ${
                  tag === t ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
