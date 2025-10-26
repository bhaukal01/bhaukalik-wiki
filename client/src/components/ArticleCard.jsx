import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="block p-4 border rounded hover:shadow-md transition bg-white dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {article.category} • {article.tags?.join(", ")}
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {article.content?.slice(0, 50)}
        {article.content?.length > 50 ? " ..." : ""}
      </p>
    </Link>
  );
}
