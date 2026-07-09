// Database wrapper to handle Firebase integration or fallback to LocalStorage
// Uses Firebase Compat SDK

const DEFAULT_SETTINGS = {
  cafeNameEN: "Saman Cafeteria",
  cafeNameAR: "كافتيريا سامان",
  cafeNameKU: "کافتریا سامان",
  whatsappNumber: "07508244332",
  bgImages: [
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop"
  ],
  logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300&auto=format&fit=crop"
};

const DEFAULT_CATEGORIES = [
  { id: "cat1", nameEN: "Hot Drinks", nameAR: "المشروبات الساخنة", nameKU: "ڤەخوارنێن گەرم", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop" },
  { id: "cat2", nameEN: "Cold Drinks", nameAR: "المشروبات الباردة", nameKU: "ڤەخوارنێن سارد", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=300&auto=format&fit=crop" },
  { id: "cat3", nameEN: "Desserts", nameAR: "الحلويات", nameKU: "شیریناهی", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop" },
  { id: "cat4", nameEN: "Snacks", nameAR: "المأكولات الخفيفة", nameKU: "خوارنێن سڤک", image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=300&auto=format&fit=crop" }
];

const DEFAULT_ITEMS = [
  { id: "item1", categoryId: "cat1", nameEN: "Espresso", nameAR: "إسبريسو", nameKU: "ئێسپریسۆ", price: 3000, descriptionEN: "Strong and rich black coffee", descriptionAR: "قهوة سوداء قوية وغنية", descriptionKU: "قەهوا ڕەش یا بهێز و تژی تەم", image: "https://images.unsplash.com/photo-1510707577719-5d6dd2949b80?q=80&w=300&auto=format&fit=crop" },
  { id: "item2", categoryId: "cat1", nameEN: "Cappuccino", nameAR: "كابتشينو", nameKU: "کاپوچينۆ", price: 4500, descriptionEN: "Espresso with steamed milk foam", descriptionAR: "إسبريسو مع رغوة الحليب المبخر", descriptionKU: "ئێسپریسۆ دگەل کەفا شیری", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=300&auto=format&fit=crop" },
  { id: "item3", categoryId: "cat2", nameEN: "Iced Latte", nameAR: "لاتيه مثلج", nameKU: "لاتێ یا سارد", price: 5000, descriptionEN: "Chilled espresso with fresh milk", descriptionAR: "إسبريسو مبرد مع حليب طازج", descriptionKU: "ئێسپریسۆیا سارد دگەل شیرێ تازہ", image: "https://images.unsplash.com/photo-1517701548126-3130d2042609?q=80&w=300&auto=format&fit=crop" },
  { id: "item4", categoryId: "cat2", nameEN: "Spanish Latte", nameAR: "سبانيش لاتيه", nameKU: "سپانيش لاتێ", price: 5500, descriptionEN: "Sweet iced espresso with condensed milk", descriptionAR: "إسبريسو مثلج حلو مع حليب مكثف", descriptionKU: "ئێسپریسۆیا سارد یا شرین دگەل شیرێ چڕکری", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop" },
  { id: "item5", categoryId: "cat3", nameEN: "Chocolate Soufflé", nameAR: "سوفليه الشوكولاتة", nameKU: "سۆفلێ یا شوکۆلاتێ", price: 6000, descriptionEN: "Warm chocolate cake with liquid center", descriptionAR: "كيكة شوكولاتة دافئة مع قلب سائل", descriptionKU: "کێکەکا شوکۆلاتێ یا گەرم دگەل ناڤەکێ شل", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop" },
  { id: "item6", categoryId: "cat4", nameEN: "Club Sandwich", nameAR: "كلوب ساندوتش", nameKU: "کلۆب ساندويچ", price: 6500, descriptionEN: "Toasted bread with chicken and veggies", descriptionAR: "خبز محمص مع دجاج وخضار", descriptionKU: "نانێ برشتی دگەل مریشک و کەسکاتیێ", image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?q=80&w=300&auto=format&fit=crop" }
];

class DatabaseService {
  constructor() {
    this.isFirebase = false;
    this.firestore = null;
    this.storage = null;
    this.TIMEOUT_MS = 3000; // 3 second timeout for Firestore reads
    this.initialize();
  }

  // Race a promise against a timeout — returns fallback value if too slow
  withTimeout(promise, fallbackValue) {
    return Promise.race([
      promise,
      new Promise((resolve) => {
        setTimeout(() => {
          console.warn("Firestore request timed out, using local fallback.");
          resolve(fallbackValue);
        }, this.TIMEOUT_MS);
      })
    ]);
  }

  handleWriteError(error) {
    console.error("Firestore write operation failed. Falling back to LocalStorage to prevent data loss/overwrite:", error);
    this.isFirebase = false;
    localStorage.setItem("saman_local_only", "true");
  }

  handleWriteSuccess() {
    if (localStorage.getItem("saman_local_only") === "true") {
      console.log("Firestore write succeeded. Clearing local-only mode.");
      localStorage.removeItem("saman_local_only");
    }
  }

  initialize() {
    // Always seed localStorage with defaults so fallback always works
    this.setupLocalStorageDefaults();

    // Check if we are running in local-only mode due to a previous Firebase write failure
    if (localStorage.getItem("saman_local_only") === "true") {
      console.warn("Running in Local-Only Mode to protect local data from being overwritten by stale Firestore data.");
      this.isFirebase = false;
      return;
    }

    try {
      // Check if global firebase is available
      if (typeof firebase !== "undefined") {
        this.firestore = firebase.firestore();
        try {
          this.storage = firebase.storage();
        } catch (e) {
          console.warn("Firebase Storage failed to initialize:", e);
        }
        this.isFirebase = true;
        console.log("Firebase DB initialized successfully.");
      } else {
        console.log("No global Firebase SDK found. Using LocalStorage fallback.");
        this.isFirebase = false;
      }
    } catch (error) {
      console.error("Failed to initialize Firebase, falling back to LocalStorage:", error);
      this.isFirebase = false;
    }
  }

  setupLocalStorageDefaults() {
    if (!localStorage.getItem("saman_settings")) {
      localStorage.setItem("saman_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem("saman_categories")) {
      localStorage.setItem("saman_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem("saman_items")) {
      localStorage.setItem("saman_items", JSON.stringify(DEFAULT_ITEMS));
    }
  }

  // --- Category Operations ---
  async getCategories() {
    const localFallback = JSON.parse(localStorage.getItem("saman_categories")) || DEFAULT_CATEGORIES;
    if (this.isFirebase && this.firestore) {
      try {
        const snapshot = await this.withTimeout(
          this.firestore.collection("categories").get(),
          null
        );
        if (!snapshot) return localFallback;
        if (snapshot.empty) {
          // Add default categories in parallel if Firebase collection is empty
          await Promise.all(DEFAULT_CATEGORIES.map(cat =>
            this.firestore.collection("categories").doc(cat.id).set(cat)
          ));
          return DEFAULT_CATEGORIES;
        }
        let categories = [];
        snapshot.forEach(doc => {
          categories.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem("saman_categories", JSON.stringify(categories));
        return categories;
      } catch (error) {
        console.error("Firestore getCategories failed, reading from local fallback:", error);
        return localFallback;
      }
    } else {
      return localFallback;
    }
  }

  async addCategory(category) {
    if (!category.id) {
      category.id = "cat_" + Date.now();
    }

    let categories = JSON.parse(localStorage.getItem("saman_categories")) || DEFAULT_CATEGORIES;
    categories.push(category);
    localStorage.setItem("saman_categories", JSON.stringify(categories));

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("categories").doc(category.id).set(category).then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore addCategory timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return category;
  }

  async updateCategory(id, updatedCategory) {
    let categories = JSON.parse(localStorage.getItem("saman_categories")) || DEFAULT_CATEGORIES;
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedCategory };
      localStorage.setItem("saman_categories", JSON.stringify(categories));
    }

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("categories").doc(id).update(updatedCategory).then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore updateCategory timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return index !== -1;
  }

  async deleteCategory(id) {
    let categories = JSON.parse(localStorage.getItem("saman_categories")) || DEFAULT_CATEGORIES;
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem("saman_categories", JSON.stringify(categories));

    let items = JSON.parse(localStorage.getItem("saman_items")) || DEFAULT_ITEMS;
    items = items.filter(i => i.categoryId !== id);
    localStorage.setItem("saman_items", JSON.stringify(items));

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          (async () => {
            await this.firestore.collection("categories").doc(id).delete();
            const itemsSnapshot = await this.firestore.collection("items").where("categoryId", "==", id).get();
            const batch = this.firestore.batch();
            itemsSnapshot.forEach(doc => {
              batch.delete(doc.ref);
            });
            await batch.commit();
            return "ok";
          })(),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore deleteCategory timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return true;
  }

  // --- Item Operations ---
  async getItems() {
    const localFallback = JSON.parse(localStorage.getItem("saman_items")) || DEFAULT_ITEMS;
    if (this.isFirebase && this.firestore) {
      try {
        const snapshot = await this.withTimeout(
          this.firestore.collection("items").get(),
          null
        );
        if (!snapshot) return localFallback;
        if (snapshot.empty) {
          await Promise.all(DEFAULT_ITEMS.map(item =>
            this.firestore.collection("items").doc(item.id).set(item)
          ));
          return DEFAULT_ITEMS;
        }
        let items = [];
        snapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem("saman_items", JSON.stringify(items));
        return items;
      } catch (error) {
        console.error("Firestore getItems failed, reading from local fallback:", error);
        return localFallback;
      }
    } else {
      return localFallback;
    }
  }

  async addItem(item) {
    if (!item.id) {
      item.id = "item_" + Date.now();
    }

    let items = JSON.parse(localStorage.getItem("saman_items")) || DEFAULT_ITEMS;
    items.push(item);
    localStorage.setItem("saman_items", JSON.stringify(items));

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("items").doc(item.id).set(item).then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore addItem timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return item;
  }

  async updateItem(id, updatedItem) {
    let items = JSON.parse(localStorage.getItem("saman_items")) || DEFAULT_ITEMS;
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem("saman_items", JSON.stringify(items));
    }

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("items").doc(id).update(updatedItem).then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore updateItem timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return index !== -1;
  }

  async deleteItem(id) {
    let items = JSON.parse(localStorage.getItem("saman_items")) || DEFAULT_ITEMS;
    items = items.filter(i => i.id !== id);
    localStorage.setItem("saman_items", JSON.stringify(items));

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("items").doc(id).delete().then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore deleteItem timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return true;
  }

  // --- Settings Operations ---
  async getSettings() {
    const localFallback = JSON.parse(localStorage.getItem("saman_settings")) || DEFAULT_SETTINGS;
    if (this.isFirebase && this.firestore) {
      try {
        const doc = await this.withTimeout(
          this.firestore.collection("settings").doc("main").get(),
          null
        );
        if (!doc) return localFallback;
        if (doc.exists) {
          const data = doc.data();
          localStorage.setItem("saman_settings", JSON.stringify(data));
          return data;
        } else {
          const initRes = await this.withTimeout(
            this.firestore.collection("settings").doc("main").set(DEFAULT_SETTINGS).then(() => "ok"),
            "timeout"
          );
          if (initRes === "timeout") {
            console.warn("Firestore initialization write timed out.");
          }
          return DEFAULT_SETTINGS;
        }
      } catch (error) {
        console.error("Firestore getSettings failed, reading from local fallback:", error);
        return localFallback;
      }
    } else {
      return localFallback;
    }
  }

  async updateSettings(updatedSettings) {
    let currentSettings = JSON.parse(localStorage.getItem("saman_settings")) || DEFAULT_SETTINGS;
    currentSettings = { ...currentSettings, ...updatedSettings };
    localStorage.setItem("saman_settings", JSON.stringify(currentSettings));

    if (this.isFirebase && this.firestore) {
      try {
        const result = await this.withTimeout(
          this.firestore.collection("settings").doc("main").set(updatedSettings, { merge: true }).then(() => "ok"),
          "timeout"
        );
        if (result === "timeout") {
          throw new Error("Firestore updateSettings timed out");
        }
        this.handleWriteSuccess();
      } catch (error) {
        this.handleWriteError(error);
      }
    }

    return true;
  }

  compressImage(file, maxWidth = 300, maxHeight = 300, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  async uploadImage(file, storagePath = "images") {
    if (this.isFirebase && this.storage) {
      try {
        const uploadResult = await this.withTimeout(
          (async () => {
            const ref = this.storage.ref().child(`${storagePath}/${Date.now()}_${file.name}`);
            const snapshot = await ref.put(file);
            const downloadUrl = await snapshot.ref.getDownloadURL();
            return downloadUrl;
          })(),
          "timeout"
        );
        if (uploadResult !== "timeout") {
          this.handleWriteSuccess();
          return uploadResult;
        }
        console.warn("Firebase Storage upload timed out. Falling back to local Base64.");
      } catch (error) {
        console.warn("Firebase Storage upload failed, falling back to base64 conversion:", error);
      }
    }
    try {
      const compressedBase64 = await this.compressImage(file);
      return compressedBase64;
    } catch (err) {
      console.error("Compression failed:", err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
}

window.dbService = new DatabaseService();
