import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";
import { PageLoading } from "../components/RouteGuards";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.getBlogPost(id).then(setPost).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoading />;

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="text-ink/60 mb-6">{error || "লেখাটি পাওয়া যায়নি।"}</p>
        <Link to="/blog" className="btn-primary">সব লেখায় ফিরে যান</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <Link to="/blog" className="text-sm text-forest font-semibold hover:underline">← সব লেখা</Link>
      <h1 className="text-3xl md:text-4xl font-semibold text-forest mt-4 mb-3 leading-snug">{post.title}</h1>
      <p className="text-sm text-ink/45 mb-8">{new Date(post.createdAt).toLocaleDateString("bn-BD")}</p>

      {post.coverImage && (
        <img
          src={optimizeImage(post.coverImage, 1200)}
          alt=""
          className="w-full rounded-lg border border-line mb-8"
        />
      )}

      {/* প্লেইন টেক্সট হিসেবে দেখানো হয় (HTML ইনজেকশন থেকে নিরাপদ); লাইন ব্রেক ধরে রাখা হয় */}
      <div className="text-ink/80 leading-loose whitespace-pre-line">{post.content}</div>
    </article>
  );
}
