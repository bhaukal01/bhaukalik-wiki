// src/pages/Article.jsx
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

  if (!article) return <p>Loading…</p>;

  return (
    <article className="max-w-none">
      <a className="text-6xl font-bold" href={`/article/${article.slug}`}>
        {article.title}
      </a>
      <p className="text-sm text-gray-500 mt-6">
        {article.tags?.join(" ● ")}
      </p>
      <p className="!mt-0 text-sm text-gray-500">
        {new Date(article.createdAt).toLocaleDateString()}{" "}
        {new Date(article.createdAt).toLocaleTimeString()}
      </p>

      <div data-color-mode="auto" className="mt-4">
        <MarkdownPreview className="px-8 py-4 border border-radius border-none rounded-xl" source={article.content} />
      </div>

      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to list
        </Link>
      </div>
    </article>
  );
}
