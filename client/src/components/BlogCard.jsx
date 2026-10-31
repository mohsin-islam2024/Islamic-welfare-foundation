import { Link } from "react-router-dom";
import { optimizeImage } from "../lib/upload";

// /blog পেজের গ্রিডে ব্যবহৃত স্ট্যান্ডার্ড কার্ড
export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post._id}`} className="group flex flex-col">
      <div className="overflow-hidden rounded-2xl border border-line bg-forest/5">
        {post.coverImage ? (
          <img
            src={optimizeImage(post.coverImage, 700)}
            alt=""
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[16/10] w-full" />
        )}
      </div>
      <p className="mt-5 text-xs text-ink/45">{new Date(post.createdAt).toLocaleDateString("bn-BD")}</p>
      <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-forest group-hover:underline decoration-gold decoration-2 underline-offset-4">
        {post.title}
      </h3>
      {post.excerpt && <p className="mt-2 text-sm leading-7 text-ink/65">{post.excerpt}</p>}
    </Link>
  );
}
