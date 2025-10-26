import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import MarkdownEditor from "../components/MarkdownEditor";

const DRAFT_KEY = "wiki_new_article_draft";

export default function AddArticle() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/wiki-admin");
  }, []);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // load draft
  useEffect(() => {
    const d = localStorage.getItem(DRAFT_KEY);
    if (d) {
      try {
        const obj = JSON.parse(d);
        setTitle(obj.title || "");
        setCategory(obj.category || "");
        setTags(obj.tags || "");
        setContent(obj.content || "");
      } catch {}
    }
  }, []);

  // autosave to localStorage (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, category, tags, content })
      );
    }, 800);
    return () => clearTimeout(id);
  }, [title, category, tags, content]);

  const handleImageUpload = async (file) => {
    // convert to base64
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
      // insert markdown image syntax
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
      await axios.post("/articles", {
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
      alert("Failed to publish");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Article</h2>

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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DRAFT_KEY);
              setTitle("");
              setCategory("");
              setTags("");
              setContent("");
            }}
            className="px-3 py-2 border rounded"
          >
            Clear Draft
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify({ title, category, tags, content })
              );
              alert("Draft saved");
            }}
            className="px-3 py-2 border rounded"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}
