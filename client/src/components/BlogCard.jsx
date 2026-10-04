import { Link } from "react-router-dom";
import { optimizeImage } from "../lib/upload";

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post._id}`}
      className="card !p-0 overflow-hidden flex flex-col hover:border-gold/60 hover:shadow-sm transition-all"
    >
      {post.coverImage ? (
        <img
          src={optimizeImage(post.coverImage, 600)}
          alt=""
          loading="lazy"
          className="w-full aspect-[16/9] object-cover"
        />
      ) : (
        <div className="w-full aspect-[16/9] bg-forest/5" />
      )}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-ink/45 mb-2">{new Date(post.createdAt).toLocaleDateString("bn-BD")}</p>
        <h3 className="font-display font-semibold text-lg text-forest mb-2 leading-snug">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-ink/65 leading-relaxed">{post.excerpt}</p>}
        <span className="mt-auto pt-4 text-sm font-semibold text-forest">পড়ুন →</span>
      </div>
    </Link>
  );
}
