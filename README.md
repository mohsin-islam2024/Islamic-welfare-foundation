# আল-ইনফাক ফাউন্ডেশন — ওয়েবসাইট

MERN স্ট্যাক (MongoDB, Express, React, Node.js) দিয়ে তৈরি ফাউন্ডেশনের ওয়েবসাইট।
অথেনটিকেশনের জন্য **Firebase Authentication** এবং ফ্রন্টএন্ড ডিপ্লয়মেন্টের জন্য **Netlify** ব্যবহার করা হয়েছে।

## ফিচারসমূহ

- প্রচ্ছদ, আমাদের সম্পর্কে, কার্যক্রম, যোগাযোগ পেজ
- দান করার ফর্ম (যাকাত, সদকা, কর্জে হাসানাহ তহবিল ইত্যাদি খাত অনুযায়ী)
- কর্জে হাসানাহ (সুদমুক্ত ঋণ) আবেদন ফর্ম — লগইন করা প্রয়োজন
- Firebase দিয়ে ইমেইল/পাসওয়ার্ড ও গুগল লগইন
- ব্যবহারকারীর ড্যাশবোর্ড — নিজের ঋণ আবেদনের অবস্থা দেখা
- অ্যাডমিন প্যানেল — দান, ঋণ আবেদন ও বার্তা পরিচালনা (নির্দিষ্ট ইমেইলের জন্য সংরক্ষিত)
- MongoDB-তে সব তথ্য সংরক্ষিত হয়, Express API-এর মাধ্যমে

## প্রজেক্ট কাঠামো

```
al-infaq-foundation/
├── client/          # React + Vite ফ্রন্টএন্ড (Netlify-তে ডিপ্লয় হবে)
├── server/          # Express + MongoDB ব্যাকএন্ড API (Render-এ ডিপ্লয় হবে)
└── netlify.toml     # Netlify বিল্ড কনফিগারেশন
```

## গুরুত্বপূর্ণ: হোস্টিং কীভাবে সাজানো হয়েছে

Netlify মূলত স্ট্যাটিক ফ্রন্টএন্ড হোস্ট করে। এটি সরাসরি Express + MongoDB সার্ভার হোস্ট করতে পারে না
(persistent database connection দরকার হয়)। তাই:

| অংশ | কোথায় হোস্ট হবে | খরচ |
|---|---|---|
| React ফ্রন্টএন্ড | **Netlify** | ফ্রি |
| Express API | **Render.com** (Web Service) | ফ্রি টায়ার |
| ডেটাবেস | **MongoDB Atlas** | ফ্রি টায়ার (M0) |
| অথেনটিকেশন | **Firebase Authentication** | ফ্রি টায়ার (Spark প্ল্যান) |

সবকটিই সম্পূর্ণ ফ্রি টায়ারে চালানো সম্ভব।

---

## ধাপ ১: MongoDB Atlas সেটআপ

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) এ ফ্রি একাউন্ট খুলুন।
2. একটি ফ্রি (M0) ক্লাস্টার তৈরি করুন।
3. **Database Access** থেকে একজন ইউজার তৈরি করুন (ইউজারনেম/পাসওয়ার্ড মনে রাখুন)।
4. **Network Access** এ গিয়ে `0.0.0.0/0` (Allow access from anywhere) যোগ করুন — Render থেকে সংযোগ করতে হলে এটি দরকার।
5. **Connect > Drivers** থেকে connection string কপি করুন। এটি দেখতে হবে এমন:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alinfaq?retryWrites=true&w=majority
   ```

## ধাপ ২: Firebase প্রজেক্ট সেটআপ

1. [console.firebase.google.com](https://console.firebase.google.com) এ গিয়ে নতুন প্রজেক্ট তৈরি করুন (যেমন `al-infaq-foundation`)।
2. **Authentication > Sign-in method** এ গিয়ে **Email/Password** এবং **Google** — দুটোই চালু করুন।
3. **Project settings > General > Your apps** এ গিয়ে একটি **Web app** যোগ করুন। এখান থেকে যে config অবজেক্ট পাবেন (`apiKey`, `authDomain`, ইত্যাদি) — এগুলো `client/.env` ফাইলে লাগবে।
4. **Project settings > Service accounts** এ গিয়ে **Generate new private key** ক্লিক করুন। যে JSON ফাইল ডাউনলোড হবে, তার পুরো কনটেন্ট এক লাইনে `server/.env` ফাইলের `FIREBASE_SERVICE_ACCOUNT` ভ্যারিয়েবলে বসবে।

   > টিপস: JSON ফাইলটি এক লাইনে রূপান্তর করতে যেকোনো JSON minifier ব্যবহার করুন, অথবা `node -e "console.log(JSON.stringify(require('./serviceAccountKey.json')))"` কমান্ড চালান।

## ধাপ ৩: ব্যাকএন্ড লোকালি চালানো (ঐচ্ছিক, টেস্টের জন্য)

```bash
cd server
cp .env.example .env
# .env ফাইলে MONGODB_URI, FIREBASE_SERVICE_ACCOUNT, ADMIN_EMAILS পূরণ করুন
npm install
npm run dev
```

সার্ভার `http://localhost:5000` এ চালু হবে। `http://localhost:5000/api/health` ভিজিট করে চেক করতে পারেন।

## ধাপ ৪: ব্যাকএন্ড Render-এ ডিপ্লয় করা

1. এই প্রজেক্টটি একটি GitHub রিপোজিটরিতে পুশ করুন।
2. [render.com](https://render.com) এ ফ্রি একাউন্ট খুলুন এবং **New > Web Service** নির্বাচন করুন।
3. আপনার GitHub রিপো কানেক্ট করুন।
4. সেটিংস দিন:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. **Environment** ট্যাবে গিয়ে `.env.example`-এর সব ভ্যারিয়েবল যোগ করুন (`MONGODB_URI`, `FIREBASE_SERVICE_ACCOUNT`, `ADMIN_EMAILS`, `CLIENT_ORIGINS`)। `CLIENT_ORIGINS`-এ আপাতত `http://localhost:5173` দিন, Netlify ডিপ্লয়ের পর আসল URL যোগ করবেন।
6. ডিপ্লয় হলে আপনি একটি URL পাবেন, যেমন `https://al-infaq-api.onrender.com`। এটি মনে রাখুন — ফ্রন্টএন্ডে লাগবে।

   > ফ্রি টায়ারের সার্ভার কিছুক্ষণ ব্যবহার না হলে "ঘুমিয়ে" যায় এবং প্রথম রিকোয়েস্টে ২০-৩০ সেকেন্ড দেরি হতে পারে — এটাই ফ্রি টায়ারের স্বাভাবিক আচরণ।

## ধাপ ৫: ফ্রন্টএন্ড লোকালি চালানো (ঐচ্ছিক, টেস্টের জন্য)

```bash
cd client
cp .env.example .env
# .env ফাইলে Firebase config ও VITE_API_BASE_URL পূরণ করুন
npm install
npm run dev
```

## ধাপ ৬: ফ্রন্টএন্ড Netlify-তে ডিপ্লয় করা

1. [netlify.com](https://netlify.com) এ ফ্রি একাউন্ট খুলুন।
2. **Add new site > Import an existing project** এ গিয়ে আপনার GitHub রিপো কানেক্ট করুন।
3. Netlify root-এর `netlify.toml` ফাইলটি স্বয়ংক্রিয়ভাবে সঠিক বিল্ড সেটিংস (base: `client`, publish: `dist`) ব্যবহার করবে।
4. **Site settings > Environment variables** এ গিয়ে `client/.env.example`-এর সব ভ্যারিয়েবল যোগ করুন:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_API_BASE_URL` → আপনার Render backend URL (যেমন `https://al-infaq-api.onrender.com`)
   - `VITE_ADMIN_EMAILS` → অ্যাডমিন ইমেইল(গুলো), কমা দিয়ে আলাদা
5. Deploy করুন। কিছুক্ষণ পর একটি URL পাবেন, যেমন `https://al-infaq-foundation.netlify.app`।
6. এই URL-টি Render-এর `CLIENT_ORIGINS` এনভায়রনমেন্ট ভ্যারিয়েবলে যোগ করে সার্ভার রিডিপ্লয় করুন (CORS ঠিকমতো কাজ করার জন্য)।
7. Firebase Console-এ **Authentication > Settings > Authorized domains**-এ আপনার Netlify ডোমেইন যোগ করুন (নাহলে লগইন কাজ করবে না)।

## ধাপ ৭: অ্যাডমিন একাউন্ট তৈরি

1. ওয়েবসাইটে গিয়ে সাধারণ ব্যবহারকারীর মতো **নিবন্ধন করুন** — যে ইমেইল দিয়ে নিবন্ধন করবেন সেটিই `ADMIN_EMAILS` (Render) ও `VITE_ADMIN_EMAILS` (Netlify) এ যোগ করা ইমেইলের সাথে মিলতে হবে।
2. মিললে, লগইন করার পর নেভিগেশন বারে **"অ্যাডমিন প্যানেল"** লিংক দেখা যাবে।

---

## নিরাপত্তা নোট

- `server/.env` ও `client/.env` ফাইল কখনো GitHub-এ পুশ করবেন না (`.gitignore`-এ যোগ করা আছে)।
- অ্যাডমিন যাচাই ব্যাকএন্ডে (`ADMIN_EMAILS`) হয়, তাই ফ্রন্টএন্ডের ভ্যারিয়েবল বদলালেও কেউ অননুমোদিতভাবে অ্যাডমিন ডেটা দেখতে পারবে না — ফ্রন্টএন্ডের চেক শুধু UI/UX-এর জন্য।
- Firebase-এর `apiKey` ইত্যাদি ফ্রন্টএন্ড কোডে প্রকাশ্য থাকাই স্বাভাবিক; আসল নিরাপত্তা Firebase Authentication ও ব্যাকএন্ডের টোকেন-ভেরিফিকেশনের উপর নির্ভরশীল।

## পরবর্তী উন্নতির সুযোগ

- বাংলা কন্টেন্টের জন্য CMS (যেমন Sanity বা Contentful) যোগ করা যেতে পারে যাতে টেক্সট পরিবর্তনে কোড এডিট করা না লাগে।
- SSLCommerz বা bKash-এর মতো লোকাল পেমেন্ট গেটওয়ে যোগ করে সরাসরি অনলাইন দান গ্রহণ করা যেতে পারে (বর্তমানে এটি শুধু দানের "অঙ্গীকার" রেকর্ড করে, প্রকৃত টাকা লেনদেন করে না)।
- ইমেইল/এসএমএস নোটিফিকেশন (যেমন ঋণ অনুমোদিত হলে ব্যবহারকারীকে জানানো)।
