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

  // true for /wiki-admin and any nested routes like /wiki-admin/...
  const onAdmin = Boolean(matchPath({ path: "/wiki-admin/*" }, pathname));

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-semibold">
          Bhaukal Wiki
        </Link>
        <Link to="/" className="text-sm text-gray-600 dark:text-gray-300">
          Knowledgebase
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {onAdmin && (
          <Link to="/wiki-admin/dashboard" className="text-sm hover:underline">
            Admin
          </Link>
        )}

        {onAdmin && isLogged && (
          <button onClick={logout} className="text-sm px-3 py-1 border rounded">
            Logout
          </button>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}
