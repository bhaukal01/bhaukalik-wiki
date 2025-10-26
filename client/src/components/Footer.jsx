// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#232a3b]/80 backdrop-blur-md shadow-lg border-t border-[#2563eb]/20">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-extrabold text-[#2563eb] tracking-tight">
            Bhaukal Wiki
          </span>
          <span className="text-sm text-gray-400 font-medium">
            &copy; 2025 All rights reserved.
          </span>
        </div>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <Link
            to="/"
            className="text-sm text-[#2563eb] hover:text-[#38bdf8] font-semibold transition"
          >
            Home
          </Link>
          <a
            href="https://github.com/bhaukal01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2563eb] hover:text-[#38bdf8] font-semibold transition"
          >
            GitHub
          </a>
          <a
            href="https://adityx.me"
            target="_blank"
            className="text-sm text-[#2563eb] hover:text-[#38bdf8] font-semibold transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
