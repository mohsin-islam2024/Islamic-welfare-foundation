import { useEffect, useState } from "react";
import { api } from "../lib/api";
import BlogCard from "../components/BlogCard";
import { PageLoading } from "../components/RouteGuards";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBlogPosts().then(setPosts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <p className="eyebrow mb-3">ব্লগ</p>
      <h1 className="text-4xl font-semibold text-forest mb-10">আমাদের লেখা</h1>

      {loading && <PageLoading />}
      {error && <p className="text-clay text-sm">{error}</p>}
      {!loading && !error && posts.length === 0 && <p className="text-ink/50">এখনো কোনো লেখা প্রকাশিত হয়নি।</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((p) => (
          <BlogCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
