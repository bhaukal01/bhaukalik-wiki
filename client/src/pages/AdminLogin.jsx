import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/wiki-admin/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-sm w-full rounded-2xl shadow-2xl bg-white/75 dark:bg-[#232a3b]/90 backdrop-blur-lg border border-[#2563eb]/20 p-7">
        <h2 className="text-2xl font-bold mb-4 text-[#2563eb] text-center tracking-tight">
          Admin Login
        </h2>
        {err && (
          <div className="mb-3 text-center text-sm text-red-500 font-medium">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full bg-white/90 text-gray-800 dark:bg-[#191d29]/80 dark:text-[#c4dafb] border border-[#3b82f6]/20 rounded-lg px-4 py-3 shadow focus:ring-2 focus:ring-[#2563eb] outline-none transition"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            spellCheck={false}
          />
          <input
            type="password"
            className="w-full bg-white/90 text-gray-800 dark:bg-[#191d29]/80 dark:text-[#c4dafb] border border-[#3b82f6]/20 rounded-lg px-4 py-3 shadow focus:ring-2 focus:ring-[#2563eb] outline-none transition"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            spellCheck={false}
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold rounded-lg bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-lg hover:opacity-90 transition"
            >
              Login
            </button>
            <a
              href="/"
              className="text-sm text-[#2563eb] font-medium hover:underline transition"
            >
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
