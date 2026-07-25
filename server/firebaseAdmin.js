import admin from "firebase-admin";

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} catch (err) {
  console.error(
    "Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is valid JSON on a single line.",
    err.message
  );
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else if (!serviceAccount) {
  console.warn(
    "FIREBASE_SERVICE_ACCOUNT not set — auth-protected routes will reject all requests until it is configured."
  );
}

export default admin;
