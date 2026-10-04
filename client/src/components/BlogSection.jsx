import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import BlogCard from "./BlogCard";

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getBlogPosts(3).then(setPosts).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-forest/5 border-y border-line">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <p className="eyebrow mb-3">ব্লগ</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-10">সাম্প্রতিক লেখা</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <BlogCard key={p._id} post={p} />
          ))}
        </div>
        <div className="mt-10">
          <Link to="/blog" className="text-forest font-semibold hover:underline">
            সব লেখা দেখুন →
          </Link>
        </div>
      </div>
    </section>
  );
}
