import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import MarkdownEditor from "../components/MarkdownEditor";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const DRAFT_KEY = `wiki_edit_draft_${id}`;

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/wiki-admin");
  }, []);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/articles");
        const a = res.data.find((item) => item._id === id);
        if (!a) throw new Error("Article not found");
        setTitle(a.title || "");
        setCategory(a.category || "");
        setTags((a.tags || []).join(", "));
        setContent(a.content || "");
        const d = localStorage.getItem(DRAFT_KEY);
        if (d) {
          const obj = JSON.parse(d);
          setTitle(obj.title || a.title || "");
          setCategory(obj.category || a.category || "");
          setTags(obj.tags || (a.tags || []).join(", "));
          setContent(obj.content || a.content || "");
        }
      } catch (err) {
        console.error(err);
        alert("Cannot load article");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // autosave draft
  useEffect(() => {
    const idt = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, category, tags, content })
      );
    }, 800);
    return () => clearTimeout(idt);
  }, [title, category, tags, content]);

  const handleImageUpload = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const res = await axios.post("/imagekit/upload", {
            file: base64,
            fileName: file.name,
          });
          resolve(res.data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleInsertImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const url = await handleImageUpload(file);
      setContent((c) => `${c}\n\n![](${url})\n\n`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await axios.put(`/articles/${id}`, {
        title,
        category,
        tags: tagArray,
        content,
        images: [],
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate("/wiki-admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-6xl bg-white/75 dark:bg-[#232a3b]/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-[#2563eb]/20 px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 text-[#2563eb] text-center tracking-tight">
          Edit Article
        </h2>
        <form onSubmit={submit} className="space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-white/90 text-gray-800 dark:bg-[#191d29]/80 dark:text-[#c4dafb] border border-[#3b82f6]/20 rounded-lg px-4 py-3 shadow focus:ring-2 focus:ring-[#2563eb] outline-none transition"
            required
            spellCheck={false}
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full bg-white/90 text-gray-800 dark:bg-[#191d29]/80 dark:text-[#c4dafb] border border-[#3b82f6]/20 rounded-lg px-4 py-3 shadow focus:ring-2 focus:ring-[#2563eb] outline-none transition"
            required
            spellCheck={false}
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full bg-white/90 text-gray-800 dark:bg-[#191d29]/80 dark:text-[#c4dafb] border border-[#3b82f6]/20 rounded-lg px-4 py-3 shadow focus:ring-2 focus:ring-[#2563eb] outline-none transition"
            spellCheck={false}
          />
          <div>
            <label className="block mb-2 text-sm font-bold text-[#2563eb]">
              Insert image
            </label>
            <input type="file" accept="image/*" onChange={handleInsertImage} />
            {saving && (
              <div className="text-sm text-gray-500 mt-2">
                Uploading image...
              </div>
            )}
          </div>
          <MarkdownEditor content={content} setContent={setContent} />
          <div className="flex flex-wrap gap-3 items-center pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold rounded-lg bg-gradient-to-r from-[#22c55e] to-[#059669] text-white shadow-lg hover:opacity-90 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                alert("Draft cleared");
              }}
              className="px-4 py-2 font-semibold rounded-lg bg-white/80 text-[#2563eb] border border-[#2563eb]/30 shadow hover:bg-[#2563eb] hover:text-white transition"
            >
              Clear Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
