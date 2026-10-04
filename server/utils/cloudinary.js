import crypto from "crypto";

// env গুলো ফাংশনের ভেতরে পড়া হচ্ছে, কারণ dotenv.config() import-এর পরে চলে
function config() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

export function isCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = config();
  return !!(cloudName && apiKey && apiSecret);
}

export function signParams(params) {
  const { apiSecret } = config();
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// Best-effort: Cloudinary থেকে ছবি মুছে ফেলা (ব্যর্থ হলেও অ্যাপ থেমে যাবে না)
export async function destroyImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    const { cloudName, apiKey } = config();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ public_id: publicId, timestamp });
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        api_key: apiKey,
        signature,
      }),
    });
  } catch (err) {
    console.error("Cloudinary destroy failed:", err.message);
  }
}
