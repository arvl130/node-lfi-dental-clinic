const admin = require("firebase-admin")

if (!process.env.FIREBASE_ADMIN_PROJECT_ID)
  throw new Error("Missing or invalid Firebase Admin project ID")

if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY)
  throw new Error("Missing or invalid Firebase Admin private key")

if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL)
  throw new Error("Missing or invalid Firebase Admin client email")

if (!process.env.FIREBASE_ADMIN_TOKEN_URI)
  throw new Error("Missing or invalid Firebase Admin token URI")

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  }),
})
