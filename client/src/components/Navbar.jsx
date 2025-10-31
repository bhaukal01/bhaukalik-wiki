import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/wiki-admin");
  };

  const isLogged = !!localStorage.getItem("token");
  const onAdmin = Boolean(matchPath({ path: "/wiki-admin/*" }, pathname));

  return (
    <nav className="w-full z-10 sticky top-0 shadow-lg bg-[#191d29] dark:bg-[#232a3b]/75 border-b-2 border-[#2563eb] transition-all drop-shadow-xl ">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 ">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="text-2xl font-extrabold text-[#38bdf8] tracking-tight hover:text-[#2563eb] transition"
          >
            Bhaukal Wiki
          </Link>
          <Link
            to="/"
            className="text-base text-gray-300 font-semibold hover:text-[#2563eb] transition"
          >
            Knowledgebase
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {onAdmin && (
            <Link
              to="/wiki-admin/dashboard"
              className="text-base text-[#2563eb] font-semibold hover:underline"
            >
              Admin
            </Link>
          )}
          {onAdmin && isLogged && (
            <button
              onClick={logout}
              className="text-sm px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-semibold shadow hover:opacity-90 transition"
            >
              Logout
            </button>
          )}
          {/* <ThemeToggle /> */} {/* Uncomment to enable theme toggle */}
        </div>
      </div>
    </nav>
  );
}
