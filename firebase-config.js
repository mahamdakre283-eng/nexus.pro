// بەکارهێنانا شێوازێ سادە و گشتی یێ فایەربەیس (Compat)
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
window.fb_doc = doc;
window.fb_setDoc = setDoc;

const firebaseConfig = {
  apiKey: "AIzaSyDqA-T7mLGNFMUhAKiHMCXr2fg6AqTCAro",
  authDomain: "green2-f52d8.firebaseapp.com",
  projectId: "green2-f52d8",
  storageBucket: "green2-f52d8.firebasestorage.app",
  messagingSenderId: "325628712284",
  appId: "1:325628712284:web:de75ac248a3fec38f1dd99"
};

// دامەزراندنا فایەربەیس و داتابەیسێ ب شێوازێ گشتی
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// نیشاندانا داتابەیسێ بۆ هەمی فایلێن دی
window.app = app;
window.db = db;