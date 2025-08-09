import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID!,
  measurementId: process.env.EXPO_PUBLIC_FB_MEASUREMENT_ID!,
});

export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export async function ensureAnonymousLogin() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return new Promise<string>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        resolve(u.uid);
        unsub();
      }
    });
  });
}
