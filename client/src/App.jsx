import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Article from "./pages/Article";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="p-6 max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/wiki-admin" element={<AdminLogin />} />
            <Route path="/wiki-admin/dashboard" element={<AdminDashboard />} />
            <Route path="/wiki-admin/add" element={<AddArticle />} />
            <Route path="/wiki-admin/edit/:id" element={<EditArticle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
