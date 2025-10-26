import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Article from "./pages/Article";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#bfdcff] via-[#93c5fd] to-[#60a5fa]">
        <Navbar />
        <main className="flex-1 py-8 px-2 sm:px-6 max-w-screen-xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/wiki-admin" element={<AdminLogin />} />
            <Route path="/wiki-admin/dashboard" element={<AdminDashboard />} />
            <Route path="/wiki-admin/add" element={<AddArticle />} />
            <Route path="/wiki-admin/edit/:id" element={<EditArticle />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
