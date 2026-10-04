import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { uploadImage, validateImage, optimizeImage, MAX_IMAGE_MB } from "../../lib/upload";
import { PageLoading } from "../RouteGuards";

export default function GalleryAdminTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [formError, setFormError] = useState("");
  const [inputKey, setInputKey] = useState(0); // ফাইল ইনপুট রিসেট করার জন্য

  useEffect(() => {
    api.getGallery().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    const bad = picked.map(validateImage).find(Boolean);
    setFormError(bad || "");
    setFiles(bad ? [] : picked);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setFormError("");
    let done = 0;
    try {
      for (const file of files) {
        setProgress(`আপলোড হচ্ছে ${done + 1}/${files.length}...`);
        const up = await uploadImage(file, "gallery");
        const item = await api.createGalleryItem({ imageUrl: up.url, publicId: up.publicId, caption });
        setItems((prev) => [item, ...prev]);
        done += 1;
      }
      setFiles([]);
      setCaption("");
      setInputKey((k) => k + 1);
    } catch (err) {
      setFormError(`${done}টি ছবি আপলোড হয়েছে। সমস্যা: ${err.message}`);
    } finally {
      setUploading(false);
      setProgress("");
    }
  };

  const remove = async (id) => {
    if (!confirm("এই ছবি মুছে ফেলতে চান?")) return;
    try {
      await api.deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload} className="card space-y-4 mb-8">
        <h3 className="font-semibold text-forest">নতুন ছবি আপলোড করুন</h3>
        <div>
          <label className="label" htmlFor="gallery-files">ছবি নির্বাচন করুন (একসাথে একাধিক হতে পারে)</label>
          <input
            key={inputKey}
            id="gallery-files"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-forest file:px-4 file:py-2 file:text-canvas file:font-semibold"
          />
          <p className="text-xs text-ink/50 mt-1">প্রতিটি ছবি সর্বোচ্চ {MAX_IMAGE_MB}MB।</p>
        </div>
        <div>
          <label className="label" htmlFor="gallery-caption">ক্যাপশন (ঐচ্ছিক)</label>
          <input
            id="gallery-caption"
            className="input"
            maxLength={200}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        {formError && <p className="text-clay text-sm font-medium">{formError}</p>}
        {progress && <p className="text-forest text-sm font-medium">{progress}</p>}
        <button type="submit" className="btn-primary" disabled={uploading || files.length === 0}>
          {uploading ? "আপলোড হচ্ছে..." : `আপলোড করুন${files.length ? ` (${files.length})` : ""}`}
        </button>
      </form>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-ink/50">গ্যালারিতে এখনো কোনো ছবি নেই।</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="card !p-2">
            <img
              src={optimizeImage(item.imageUrl, 400)}
              alt={item.caption || ""}
              loading="lazy"
              className="w-full aspect-square object-cover rounded"
            />
            {item.caption && <p className="text-xs text-ink/60 mt-2 line-clamp-2">{item.caption}</p>}
            <button
              onClick={() => remove(item._id)}
              className="mt-2 text-xs font-semibold text-clay hover:underline"
            >
              মুছুন
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
