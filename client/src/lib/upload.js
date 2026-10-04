import { api } from "./api";

export const MAX_IMAGE_MB = 5;

export function validateImage(file) {
  if (!file.type.startsWith("image/")) return "শুধু ছবি (JPG, PNG, WebP) আপলোড করা যাবে।";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `ছবি ${MAX_IMAGE_MB}MB-এর বেশি হতে পারবে না।`;
  return "";
}

// folder: "gallery" | "blog". সার্ভার থেকে সই নিয়ে সরাসরি Cloudinary-তে আপলোড হয়।
export async function uploadImage(file, folder) {
  const sig = await api.getUploadSignature(folder);

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", sig.timestamp);
  fd.append("folder", sig.folder);
  fd.append("signature", sig.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
  return { url: data.secure_url, publicId: data.public_id };
}

// দ্রুত লোডের জন্য Cloudinary-তে ছোট/অপ্টিমাইজড সাইজ চাওয়া
export function optimizeImage(url, width = 800) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
