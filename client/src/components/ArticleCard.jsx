import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="block p-5 rounded-xl bg-gradient-to-br from-[#232a3b]/10 to-[#263147]/10 border border-[#3b82f6]/20 shadow-lg hover:shadow-2xl hover:border-[#38bdf8] transition-all duration-150 group"
    >
      <h2 className="text-2xl font-extrabold mb-1 text-white group-hover:text-[#38bdf8] transition">
        {article.title}
      </h2>
      <div className="flex flex-wrap gap-2 items-center text-xs mb-2">
        {article.category && (
          <span className="px-2 py-0.5 rounded-full bg-[#000000]/20 text-[#ffffff] font-semibold uppercase trackinng-wider">
            {article.category}
          </span>
        )}
        {article.tags?.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full bg-white/10 text-[#a3aed6] border border-[#3b82f6]/40 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-1 text-sm text-[#dbeafe] group-hover:text-white line-clamp-3">
        {article.content?.slice(0, 120)}
        {article.content?.length > 120 ? " ..." : ""}
      </p>
    </Link>
  );
}
