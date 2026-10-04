import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { uploadImage, validateImage, optimizeImage, MAX_IMAGE_MB } from "../../lib/upload";
import { PageLoading } from "../RouteGuards";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverPublicId: "",
  published: true,
};

export default function BlogAdminTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    api.getAllBlogPosts().then(setPosts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bad = validateImage(file);
    if (bad) {
      setFormError(bad);
      return;
    }
    setUploading(true);
    setFormError("");
    try {
      const up = await uploadImage(file, "blog");
      setForm((f) => ({ ...f, coverImage: up.url, coverPublicId: up.publicId }));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        const updated = await api.updateBlogPost(editingId, form);
        setPosts((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
      } else {
        const created = await api.createBlogPost(form);
        setPosts((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      excerpt: p.excerpt || "",
      content: p.content,
      coverImage: p.coverImage || "",
      coverPublicId: p.coverPublicId || "",
      published: p.published,
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublished = async (p) => {
    try {
      const updated = await api.updateBlogPost(p._id, { published: !p.published });
      setPosts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("এই লেখা মুছে ফেলতে চান?")) return;
    try {
      await api.deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card space-y-4 mb-8">
        <h3 className="font-semibold text-forest">{editingId ? "লেখা সম্পাদনা করুন" : "নতুন লেখা"}</h3>

        <div>
          <label className="label" htmlFor="blog-title">শিরোনাম *</label>
          <input id="blog-title" className="input" maxLength={200} value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>

        <div>
          <label className="label" htmlFor="blog-excerpt">সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
          <textarea
            id="blog-excerpt"
            className="input"
            rows={2}
            maxLength={300}
            placeholder="খালি রাখলে লেখার শুরু থেকে স্বয়ংক্রিয়ভাবে নেওয়া হবে"
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="blog-content">লেখা *</label>
          <textarea
            id="blog-content"
            className="input"
            rows={10}
            maxLength={20000}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
          />
          <p className="text-xs text-ink/50 mt-1">অনুচ্ছেদ আলাদা করতে একটি ফাঁকা লাইন দিন।</p>
        </div>

        <div>
          <label className="label" htmlFor="blog-cover">কভার ছবি (ঐচ্ছিক, সর্বোচ্চ {MAX_IMAGE_MB}MB)</label>
          <input
            id="blog-cover"
            type="file"
            accept="image/*"
            onChange={handleCover}
            disabled={uploading}
            className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-forest file:px-4 file:py-2 file:text-canvas file:font-semibold"
          />
          {uploading && <p className="text-xs text-forest mt-2">ছবি আপলোড হচ্ছে...</p>}
          {form.coverImage && (
            <div className="mt-3 flex items-center gap-3">
              <img src={optimizeImage(form.coverImage, 300)} alt="" className="h-20 rounded border border-line" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, coverImage: "", coverPublicId: "" }))}
                className="text-xs font-semibold text-clay hover:underline"
              >
                ছবি সরান
              </button>
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
          প্রকাশ করুন (আনচেক করলে খসড়া হিসেবে থাকবে)
        </label>

        {formError && <p className="text-clay text-sm font-medium">{formError}</p>}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving || uploading}>
            {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "লেখা যোগ করুন"}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              বাতিল
            </button>
          )}
        </div>
      </form>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}
      {!loading && !error && posts.length === 0 && <p className="text-ink/50">কোনো লেখা নেই।</p>}

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p._id} className={`card flex flex-wrap items-start justify-between gap-3 ${!p.published ? "opacity-60" : ""}`}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-forest">{p.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-forest/15 text-forest" : "bg-ink/10 text-ink/50"}`}>
                  {p.published ? "প্রকাশিত" : "খসড়া"}
                </span>
              </div>
              <p className="text-xs text-ink/40 mt-1">{new Date(p.createdAt).toLocaleDateString("bn-BD")}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => startEdit(p)} className="text-xs font-semibold text-forest hover:underline">সম্পাদনা</button>
              <button onClick={() => togglePublished(p)} className="text-xs font-semibold text-forest hover:underline">
                {p.published ? "খসড়া করুন" : "প্রকাশ করুন"}
              </button>
              <button onClick={() => remove(p._id)} className="text-xs font-semibold text-clay hover:underline">মুছুন</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
