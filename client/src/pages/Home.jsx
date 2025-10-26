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
    // eslint-disable-next-line
  }, [search, category, tag, sort]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Main Feed */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, tags, content..."
            className="flex-1 bg-white/80 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-sm border border-[#e3eaf5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/90 text-gray-800 border border-[#e3eaf5] rounded-lg px-4 py-3 shadow-sm focus:ring-[#6366f1] transition"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/90 text-gray-800 border border-[#e3eaf5] rounded-lg px-4 py-3 shadow-sm focus:ring-[#6366f1] transition"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="grid gap-6">
          {articles.length === 0 ? (
            <p className="text-lg text-gray-400 mt-10">No articles found.</p>
          ) : (
            articles
              .slice()
              .sort((a, b) =>
                sort === "newest"
                  ? new Date(b.createdAt) - new Date(a.createdAt)
                  : new Date(a.createdAt) - new Date(b.createdAt)
              )
              .map((a) => (
                <div
                  key={a._id}
                  className="rounded-xl bg-gradient-to-br from-[#232a3b]/80 to-[#263147]/90 shadow-xl border border-[#2a385a]/30 hover:scale-[1.01] hover:shadow-2xl transition-all duration-150"
                >
                  <ArticleCard article={a} />
                </div>
              ))
          )}
        </div>
      </section>
      {/* Sidebar */}
      <aside className="w-full max-w-xs lg:max-w-xs bg-[#191d29] rounded-2xl shadow-2xl p-6 border border-[#394054]/40 self-start">
        <h3 className="text-[#3b82f6] font-extrabold mb-4 tracking-wide text-lg uppercase">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTag("")}
            className={`px-3 py-1.5 rounded-full border font-semibold transition
              ${
                tag === ""
                  ? "bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] text-white border-none shadow ring-2 ring-[#38bdf8]"
                  : "bg-white/10 text-[#a3aed6] border-[#3b82f6]/40 hover:bg-[#38bdf8]/80 hover:text-white"
              }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-full border font-semibold transition
                ${
                  tag === t
                    ? "bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] text-white border-none shadow ring-2 ring-[#38bdf8]"
                    : "bg-white/10 text-[#a3aed6] border-[#3b82f6]/40 hover:bg-[#38bdf8]/80 hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
