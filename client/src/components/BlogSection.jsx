import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/upload";

const fmt = (d) => new Date(d).toLocaleDateString("bn-BD");

function Featured({ post, wide }) {
  return (
    <Link
      to={`/blog/${post._id}`}
      className={`group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-forest ${
        wide ? "lg:col-span-3" : "lg:col-span-2"
      }`}
    >
      {post.coverImage && (
        <img
          src={optimizeImage(post.coverImage, 1200)}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/55 to-forest-dark/5" />
      <div className="p-7 md:p-10">
        <p className="text-xs text-canvas/70">{fmt(post.createdAt)}</p>
        <h3 className="mt-2 max-w-xl font-headline text-3xl font-normal leading-[1.35] text-canvas md:text-4xl">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-3 max-w-xl text-sm leading-7 text-canvas/75">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

function Compact({ post }) {
  return (
    <Link
      to={`/blog/${post._id}`}
      className="group flex gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-gold/60"
    >
      {post.coverImage ? (
        <img
          src={optimizeImage(post.coverImage, 240)}
          alt=""
          loading="lazy"
          className="h-24 w-24 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="h-24 w-24 shrink-0 rounded-xl bg-forest/10" />
      )}
      <div className="min-w-0">
        <p className="text-xs text-ink/45">{fmt(post.createdAt)}</p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-forest">{post.title}</h3>
      </div>
    </Link>
  );
}

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getBlogPosts(3).then(setPosts).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="mt-24 border-y border-line bg-forest/[0.04]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-headline text-4xl font-normal leading-[1.3] text-forest md:text-5xl">সাম্প্রতিক লেখা</h2>
          <Link to="/blog" className="btn-secondary">সব লেখা দেখুন</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Featured post={featured} wide={rest.length === 0} />
          {rest.length > 0 && (
            <div className="flex flex-col gap-4">
              {rest.map((p) => (
                <Compact key={p._id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
