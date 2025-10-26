import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`/articles/${slug}`).then((res) => setArticle(res.data));
  }, [slug]);

  if (!article)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-lg text-gray-500 animate-pulse">Loading…</p>
      </div>
    );

  return (
    <article className="w-full max-w-5xl mx-auto bg-[#0b3460]/75 shadow-2xl border border-[#2563eb]/20 rounded-2xl px-8 py-10 mb-10 backdrop-blur-lg">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 text-white drop-shadow-lg">
        {article.title}
      </h1>
      <div className="flex flex-wrap gap-2 items-center mb-6">
        {article.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-white text-[#2563eb] font-bold shadow text-xs border border-[#2563eb]/60"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-400 mb-6">
        {new Date(article.createdAt).toLocaleDateString()} &middot;{" "}
        {new Date(article.createdAt).toLocaleTimeString()}
      </div>
      <div
        data-color-mode="auto"
        className="mt-4 mb-6 bg-white/95 dark:bg-[#232a3b]/90 border border-[#dfebfe] dark:border-[#232a3b] rounded-2xl shadow-lg"
      >
        <MarkdownPreview
          className="prose !max-w-none px-8 py-6 text-gray-900 dark:text-[#e9ecf7] rounded-2xl dark:prose-invert"
          source={article.content}
        />
      </div>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block text-[#ffffff] hover:bg-[#ffffff]/10 transition px-4 py-2 rounded-lg font-semibold"
        >
          ← Back to list
        </Link>
      </div>
    </article>
  );
}
