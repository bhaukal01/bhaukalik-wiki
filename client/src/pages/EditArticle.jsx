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
        // try to fetch specific article by slug route is not suitable here.
        // We attempt to fetch all articles and find by id (backend does not provide GET /articles/:id)
        const res = await axios.get("/articles");
        const a = res.data.find((item) => item._id === id);
        if (!a) throw new Error("Article not found");
        setTitle(a.title || "");
        setCategory(a.category || "");
        setTags((a.tags || []).join(", "));
        setContent(a.content || "");
        // if there's a draft override
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border px-3 py-2 rounded"
        />
        <div>
          <label className="block mb-2 text-sm">Insert image</label>
          <input type="file" accept="image/*" onChange={handleInsertImage} />
          {saving && (
            <div className="text-sm text-gray-500 mt-2">Uploading image...</div>
          )}
        </div>
        <MarkdownEditor content={content} setContent={setContent} />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DRAFT_KEY);
              alert("Draft cleared");
            }}
            className="px-3 py-2 border rounded"
          >
            Clear Draft
          </button>
        </div>
      </form>
    </div>
  );
}
