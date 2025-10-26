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
    <div className="max-w-md mx-auto border p-6 rounded bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      {err && <div className="mb-3 text-red-500">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <a href="/" className="text-sm text-gray-600">
            Back
          </a>
        </div>
      </form>
    </div>
  );
}
