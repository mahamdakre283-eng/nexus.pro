// Translations dictionary for Kurdish (Badini Dialect), Arabic, and English
const translations = {
  ku: {
    cafeName: "کافتریا سامان",
    cafeSubtitle: "ب خێرهاتی بۆ کافتریا سامان",
    searchPlaceholder: "گەڕیان بۆ خوارن یان ڤەخوارنان...",
    categoriesTitle: "پۆلێنێن مە",
    activeCategoryAll: "هەمی بابەت",
    itemsCountSuffix: "بابەت",
    cartPreviewText: "سەبەتە",
    cartModalTitle: "سەبەتەیا داواکاریان",
    noteLabel: "تێبینی:",
    notePlaceholder: "تێبینیێن خۆ بنڤیسە (بێ شەکر، ...)",
    totalLabel: "کۆم:",
    sendOrderBtnText: "فرێکرنا داواکاریێ ب وەتسئەپی",
    clearOrderBtnText: "پاککرنا سەبەتەیێ",
    receiptTitle: "داواکاریا تە هاتە فرێکرن",
    addedToCart: "بابەت هاتە زێدەکرن بۆ سەبەتێ",
    emptyCartText: "سەبەتا تە یا ڤالا یە",
    itemPriceSuffix: "د.ع",
    toastCategoryEmpty: "چ بابەت د ڤێ پۆلێنێ دا نینن",
    whatsappTemplate: "*داواکاریەکا نوو ژ کافتریا سامان*\n\n*تێبینی:* {note}\n\n*داواکاری:*\n{items}\n\n*کۆم:* {total} د.ع"
  },
  ar: {
    cafeName: "كافتيريا سامان",
    cafeSubtitle: "أهلاً بك في كافتيريا سامان",
    searchPlaceholder: "ابحث عن مشروب أو طعام...",
    categoriesTitle: "فئاتنا",
    activeCategoryAll: "جميع العناصر",
    itemsCountSuffix: "عنصر",
    cartPreviewText: "السلة",
    cartModalTitle: "سلة الطلبات",
    noteLabel: "ملاحظات:",
    notePlaceholder: "اكتب ملاحظاتك (بدون سكر، ...)",
    totalLabel: "المجموع:",
    sendOrderBtnText: "إرسال الطلب عبر الواتساب",
    clearOrderBtnText: "مسح السلة",
    receiptTitle: "تم إرسال الطلب",
    addedToCart: "تمت إضافة العنصر إلى السلة",
    emptyCartText: "سلة الطلبات فارغة حالياً",
    itemPriceSuffix: "د.ع",
    toastCategoryEmpty: "لا توجد عناصر في هذه الفئة",
    whatsappTemplate: "*طلب جديد من كافتيريا سامان*\n\n*ملاحظات:* {note}\n\n*الطلبات:*\n{items}\n\n*المجموع:* {total} د.ع"
  },
  en: {
    cafeName: "Saman Cafeteria",
    cafeSubtitle: "Welcome to Saman Cafeteria",
    searchPlaceholder: "Search for drinks or food...",
    categoriesTitle: "Our Categories",
    activeCategoryAll: "All Items",
    itemsCountSuffix: "items",
    cartPreviewText: "Cart",
    cartModalTitle: "Order Basket",
    noteLabel: "Special Notes:",
    notePlaceholder: "E.g. No sugar, extra ice...",
    totalLabel: "Total:",
    sendOrderBtnText: "Send Order via WhatsApp",
    clearOrderBtnText: "Clear Basket",
    receiptTitle: "Order Submitted",
    addedToCart: "Item added to cart",
    emptyCartText: "Your basket is empty",
    itemPriceSuffix: "IQD",
    toastCategoryEmpty: "No items in this category",
    whatsappTemplate: "*New Order from Saman Cafeteria*\n\n*Notes:* {note}\n\n*Order Items:*\n{items}\n\n*Total:* {total} IQD"
  }
};

// Application State
let currentLanguage = localStorage.getItem("saman_lang") || "ku";
let activeCategoryId = "all";
let cart = JSON.parse(localStorage.getItem("saman_cart") || "[]");
let dbSettings = {};
let dbCategories = [];
let dbItems = [];
let bgSliderInterval = null;

// Initialize App
document.addEventListener("DOMContentLoaded", async () => {
  setLanguage(currentLanguage);
  await loadData();
  setupCartEvents();
});

async function loadData() {
  try {
    // Load all data in PARALLEL for fastest possible load
    const [settings, categories, items] = await Promise.all([
      window.dbService.getSettings(),
      window.dbService.getCategories(),
      window.dbService.getItems()
    ]);
    
    dbSettings = settings;
    dbCategories = categories;
    dbItems = items;

    // Refresh translation with correct DB settings (especially Café Name)
    setLanguage(currentLanguage);

    // Render elements
    renderLogoAndBackgrounds();
    renderCategories();
    renderMenuItems();
  } catch (error) {
    console.error("Error loading menu data:", error);
    showToast("Error loading data. Using default local data.");
  }
}

// Render dynamic logo and start background slideshow
function renderLogoAndBackgrounds() {
  // Update logo images
  const logoImg = document.getElementById("appLogo");
  if (logoImg && dbSettings.logo) {
    logoImg.src = dbSettings.logo;
  }

  // Start the top image slideshow changing every 3 seconds
  if (dbSettings.bgImages && dbSettings.bgImages.length > 0) {
    const slides = [
      document.getElementById("slide0"),
      document.getElementById("slide1"),
      document.getElementById("slide2")
    ];

    slides.forEach((slide, index) => {
      if (slide) {
        // Fallback to default if settings index doesn't exist
        const imgUrl = dbSettings.bgImages[index] || DEFAULT_SETTINGS.bgImages[index];
        slide.style.backgroundImage = `url('${imgUrl}')`;
      }
    });

    let currentSlideIndex = 0;
    if (bgSliderInterval) clearInterval(bgSliderInterval);

    // Initial state
    slides.forEach((slide, index) => {
      if (slide) {
        if (index === 0) slide.classList.add("active");
        else slide.classList.remove("active");
      }
    });

    // 3 seconds slide changer
    bgSliderInterval = setInterval(() => {
      if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.remove("active");
      }
      currentSlideIndex = (currentSlideIndex + 1) % dbSettings.bgImages.length;
      if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add("active");
      }
    }, 3000);
  }
}

// Set Active Language
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("saman_lang", lang);

  // Update body lang class & text direction
  document.body.className = `lang-${lang}`;
  if (lang === "ku" || lang === "ar") {
    document.body.dir = "rtl";
  } else {
    document.body.dir = "ltr";
  }

  // Update active language selector buttons
  const langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick").includes(lang)) {
      btn.classList.add("active");
    }
  });

  // Translate static labels
  const dict = translations[lang];

  // Set café name dynamically from settings database if present
  let cafeName = dbSettings.cafeNameEN || dict.cafeName;
  if (lang === "ku") cafeName = dbSettings.cafeNameKU || dbSettings.cafeNameEN || dict.cafeName;
  else if (lang === "ar") cafeName = dbSettings.cafeNameAR || dbSettings.cafeNameEN || dict.cafeName;

  document.getElementById("cafeName").textContent = cafeName;
  document.getElementById("cafeSubtitle").textContent = dict.cafeSubtitle;
  document.getElementById("searchInput").placeholder = dict.searchPlaceholder;
  document.getElementById("categoriesTitle").textContent = dict.categoriesTitle;
  document.getElementById("cartPreviewText").textContent = dict.cartPreviewText;
  document.getElementById("cartModalTitle").textContent = dict.cartModalTitle;
  document.getElementById("noteLabel").textContent = dict.noteLabel;
  document.getElementById("orderNote").placeholder = dict.notePlaceholder;
  document.getElementById("totalLabel").textContent = dict.totalLabel;
  document.getElementById("sendOrderBtnText").textContent = dict.sendOrderBtnText;
  document.getElementById("clearOrderBtnText").textContent = dict.clearOrderBtnText;

  // Update active category name header
  const activeNameHeader = document.getElementById("activeCategoryName");
  if (activeNameHeader) {
    if (activeCategoryId === "all") {
      activeNameHeader.textContent = dict.activeCategoryAll;
    } else {
      const activeCat = dbCategories.find(c => String(c.id) === String(activeCategoryId));
      if (activeCat) {
        let name = activeCat.nameEN;
        if (lang === "ku") name = activeCat.nameKU || activeCat.nameEN;
        else if (lang === "ar") name = activeCat.nameAR || activeCat.nameEN;
        activeNameHeader.textContent = name;
      }
    }
  }

  // Update top header title and page title
  updateTopHeaderName();

  // Refresh lists to display language translation correctly
  renderCategories();
  renderMenuItems();
  renderCart();
}

// Render circular category slider at the top
function renderCategories() {
  const container = document.getElementById("categoriesContainer");
  if (!container) return;

  const dict = translations[currentLanguage];

  let html = `
    <div class="category-card category-all ${activeCategoryId === "all" ? "active" : ""}" onclick="selectCategory('all')">
      <div class="category-circle-wrapper">
        <i class="fa-solid fa-grip"></i>
      </div>
      <span>${dict.activeCategoryAll}</span>
    </div>
  `;

  dbCategories.forEach(cat => {
    let name = cat.nameEN;
    if (currentLanguage === "ku") name = cat.nameKU || cat.nameEN;
    else if (currentLanguage === "ar") name = cat.nameAR || cat.nameEN;

    html += `
      <div class="category-card ${activeCategoryId === cat.id ? "active" : ""}" onclick="selectCategory('${cat.id}')">
        <div class="category-circle-wrapper">
          <img src="${cat.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150'}" alt="${name}">
        </div>
        <span>${name}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Select category handler — with animated grid transition
function selectCategory(id) {
  if (id === activeCategoryId) return; // No change needed

  const grid = document.getElementById("menuGrid");
  const gridHeader = document.querySelector(".grid-header");

  // Step 1: Fade out the current grid
  if (grid) grid.classList.add("grid-exit");
  if (gridHeader) gridHeader.classList.add("grid-exit");

  setTimeout(() => {
    activeCategoryId = id;
    renderCategories();

    // Update header text in items grid
    const activeNameHeader = document.getElementById("activeCategoryName");
    const dict = translations[currentLanguage];

    if (id === "all") {
      activeNameHeader.textContent = dict.activeCategoryAll;
    } else {
      const activeCat = dbCategories.find(c => String(c.id) === String(id));
      if (activeCat) {
        let name = activeCat.nameEN;
        if (currentLanguage === "ku") name = activeCat.nameKU || activeCat.nameEN;
        else if (currentLanguage === "ar") name = activeCat.nameAR || activeCat.nameEN;
        activeNameHeader.textContent = name;
      }
    }

    // Update categories section title and document title
    updateTopHeaderName();

    // Step 2: Render new items and animate them in
    renderMenuItems(null, true);

    // Remove exit class and add enter class
    if (grid) {
      grid.classList.remove("grid-exit");
      grid.classList.add("grid-enter");
    }
    if (gridHeader) {
      gridHeader.classList.remove("grid-exit");
      gridHeader.classList.add("grid-enter");
    }

    // Step 3: Stagger-animate individual cards
    if (grid) {
      const cards = grid.querySelectorAll(".menu-item-card");
      cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px) scale(0.97)";
        setTimeout(() => {
          card.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          card.style.opacity = "1";
          card.style.transform = "translateY(0) scale(1)";
        }, 60 * index); // 60ms stagger per card
      });
    }

    // Clean up animation classes
    setTimeout(() => {
      if (grid) grid.classList.remove("grid-enter");
      if (gridHeader) gridHeader.classList.remove("grid-enter");
    }, 500);

  }, 250); // Wait for exit animation to finish
}

// Update the categories section title and browser tab title dynamically
function updateTopHeaderName() {
  const dict = translations[currentLanguage];
  const categoriesTitle = document.getElementById("categoriesTitle");

  // Cafe name translation
  let cafeName = dbSettings.cafeNameEN || dict.cafeName;
  if (currentLanguage === "ku") cafeName = dbSettings.cafeNameKU || dbSettings.cafeNameEN || dict.cafeName;
  else if (currentLanguage === "ar") cafeName = dbSettings.cafeNameAR || dbSettings.cafeNameEN || dict.cafeName;

  let activeName = "";
  if (activeCategoryId === "all") {
    activeName = dict.activeCategoryAll;
  } else {
    const activeCat = dbCategories.find(c => String(c.id) === String(activeCategoryId));
    if (activeCat) {
      activeName = activeCat.nameEN;
      if (currentLanguage === "ku") activeName = activeCat.nameKU || activeCat.nameEN;
      else if (currentLanguage === "ar") activeName = activeCat.nameAR || activeCat.nameEN;
    }
  }

  // 1. Update browser tab title
  if (activeCategoryId === "all") {
    document.title = cafeName;
  } else {
    document.title = `${activeName} | ${cafeName}`;
  }

  // 2. Update the categories section title with animated transition
  if (categoriesTitle) {
    categoriesTitle.style.opacity = "0";
    categoriesTitle.style.transform = "translateY(-4px)";

    setTimeout(() => {
      if (activeCategoryId === "all") {
        categoriesTitle.textContent = dict.categoriesTitle;
        categoriesTitle.classList.remove("category-active");
      } else {
        categoriesTitle.textContent = activeName;
        categoriesTitle.classList.add("category-active");
      }
      categoriesTitle.style.opacity = "1";
      categoriesTitle.style.transform = "translateY(0)";
    }, 150);
  }
}

// Render Menu items inside 2-Column Responsive Grid
// animate parameter triggers stagger animation on cards
function renderMenuItems(filteredItems = null, animate = false) {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const dict = translations[currentLanguage];
  let itemsToRender = filteredItems || dbItems;

  // If category is specific and no search query filter is running
  if (!filteredItems && activeCategoryId !== "all") {
    itemsToRender = dbItems.filter(item => item.categoryId === activeCategoryId);
  }

  // Update items count badge
  document.getElementById("itemsCount").textContent = `${itemsToRender.length} ${dict.itemsCountSuffix}`;

  if (itemsToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <i class="fa-solid fa-cookie-bite" style="font-size: 32px; opacity: 0.15; margin-bottom: 8px;"></i>
        <p>${dict.toastCategoryEmpty}</p>
      </div>
    `;
    return;
  }

  let html = "";
  itemsToRender.forEach(item => {
    let name = item.nameEN;
    let desc = item.descriptionEN || "";
    if (currentLanguage === "ku") {
      name = item.nameKU || item.nameEN;
      desc = item.descriptionKU || item.descriptionEN || "";
    } else if (currentLanguage === "ar") {
      name = item.nameAR || item.nameEN;
      desc = item.descriptionAR || item.descriptionEN || "";
    }

    // Format price beautifully
    const formattedPrice = formatCurrency(item.price);

    html += `
      <div class="menu-item-card" onclick="addToCart('${item.id}')">
        <!-- Optional highlight yellow helper tag on popular items (random or setting-based) -->
        ${item.price > 6000 ? `<div class="helper-badge"><i class="fa-solid fa-star"></i> VIP</div>` : ''}
        
        <div class="item-img-container">
          <img src="${item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}" alt="${name}" loading="lazy">
        </div>
        <div class="item-details">
          <h3 class="item-name">${name}</h3>
          <p class="item-desc">${desc}</p>
          <div class="item-footer-row">
            <span class="item-price">${formattedPrice}</span>
            <button class="add-to-cart-btn">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Local Search logic
function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  if (query === "") {
    renderMenuItems();
    return;
  }

  const filtered = dbItems.filter(item => {
    const nameEN = (item.nameEN || "").toLowerCase();
    const nameAR = (item.nameAR || "").toLowerCase();
    const nameKU = (item.nameKU || "").toLowerCase();
    const descEN = (item.descriptionEN || "").toLowerCase();
    const descAR = (item.descriptionAR || "").toLowerCase();
    const descKU = (item.descriptionKU || "").toLowerCase();

    return nameEN.includes(query) ||
      nameAR.includes(query) ||
      nameKU.includes(query) ||
      descEN.includes(query) ||
      descAR.includes(query) ||
      descKU.includes(query);
  });

  renderMenuItems(filtered);
}

// Cart Mechanics
function addToCart(itemId) {
  const item = dbItems.find(i => i.id === itemId);
  if (!item) return;

  const existing = cart.find(c => c.item.id === itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ item, quantity: 1 });
  }

  renderCart();
  showCartToast(itemId);
}

function updateCartQty(itemId, change) {
  const index = cart.findIndex(c => c.item.id === itemId);
  if (index !== -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  renderCart();
}

// Render dynamic cart drawer elements
function renderCart() {
  // Save cart to LocalStorage so it is not temporary
  localStorage.setItem("saman_cart", JSON.stringify(cart));

  const badge = document.getElementById("cartBadgeCount");
  const floatingBtn = document.getElementById("floatingCartBtn");
  const previewTotal = document.getElementById("cartPreviewTotal");
  const modalBody = document.getElementById("cartItemsContainer");
  const modalTotal = document.getElementById("cartTotalValue");

  const dict = translations[currentLanguage];

  // Calculate items count and total price
  const totalCount = cart.reduce((sum, current) => sum + current.quantity, 0);
  const totalPrice = cart.reduce((sum, current) => sum + (current.item.price * current.quantity), 0);

  // Update counts and pricing views
  badge.textContent = totalCount;
  previewTotal.textContent = formatCurrency(totalPrice);
  modalTotal.textContent = formatCurrency(totalPrice);

  // Show/Hide Floating Bar at the bottom (always visible)
  floatingBtn.classList.add("visible");

  // Render Modal Cart Items
  if (cart.length === 0) {
    modalBody.innerHTML = `
      <div class="empty-cart-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>${dict.emptyCartText}</p>
      </div>
    `;
    return;
  }

  let html = "";
  cart.forEach(cartItem => {
    const item = cartItem.item;
    let name = item.nameEN;
    if (currentLanguage === "ku") name = item.nameKU || item.nameEN;
    else if (currentLanguage === "ar") name = item.nameAR || item.nameEN;

    html += `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <img src="${item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150'}" alt="${name}" class="cart-item-img">
          <div class="cart-item-meta">
            <h4>${name}</h4>
            <span>${formatCurrency(item.price * cartItem.quantity)}</span>
          </div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-val">${cartItem.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  });

  modalBody.innerHTML = html;
}

// Modal open/close trigger
function toggleCartModal(open) {
  const backdrop = document.getElementById("cartModalBackdrop");
  if (backdrop) {
    if (open) {
      backdrop.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      backdrop.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  }
}

// Setup background dismiss touch/click listeners
function setupCartEvents() {
  document.getElementById("cartModalBackdrop").addEventListener("click", () => {
    toggleCartModal(false);
  });
}

// Currency format helper
function formatCurrency(value) {
  const dict = translations[currentLanguage];
  return `${value.toLocaleString()} ${dict.itemPriceSuffix}`;
}

// Helper to format WhatsApp phone numbers to international standard (Iraq prefix 964)
function formatWhatsAppNumber(num) {
  if (!num) return "9647508244332";
  // Remove any spaces, plus signs, dashes
  let clean = num.replace(/[\s\+\-]/g, "");
  // If it starts with 07, replace 0 with 964
  if (clean.startsWith("07")) {
    clean = "964" + clean.slice(1);
  }
  // If it starts with 7 without 964, prepend 964
  else if (clean.startsWith("7") && clean.length === 10) {
    clean = "964" + clean;
  }
  return clean;
}

let currentOrderNote = "-";

// Send structured order text via WhatsApp API - Now opens receipt modal first
function sendOrder() {
  const noteInput = document.getElementById("orderNote");
  const noteVal = noteInput.value.trim() || "-";

  const dict = translations[currentLanguage];

  if (cart.length === 0) {
    showToast(dict.emptyCartText);
    return;
  }

  // Close the cart drawer modal
  toggleCartModal(false);

  // Show the receipt modal first
  showReceipt(noteVal);
}

// Show receipt on beautifully formatted thermal paper
function showReceipt(noteVal) {
  currentOrderNote = noteVal;
  const dict = translations[currentLanguage];

  // Cafe name
  let cafeName = dbSettings.cafeNameEN || dict.cafeName;
  if (currentLanguage === "ku") cafeName = dbSettings.cafeNameKU || dbSettings.cafeNameEN || dict.cafeName;
  else if (currentLanguage === "ar") cafeName = dbSettings.cafeNameAR || dbSettings.cafeNameEN || dict.cafeName;
  document.getElementById("receiptCafeName").textContent = cafeName;

  // Labels & Subtitle
  document.getElementById("receiptSubtitle").textContent = dict.receiptTitle;

  // Date & Time
  const now = new Date();
  const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("receiptDateLabel").textContent = currentLanguage === "en" ? "Date:" : (currentLanguage === "ar" ? "التاريخ:" : "ڕێکەوت:");
  document.getElementById("receiptDateVal").textContent = dateStr;

  // Table columns
  document.getElementById("receiptItemCol").textContent = currentLanguage === "en" ? "Item" : (currentLanguage === "ar" ? "المادة" : "بابەت");
  document.getElementById("receiptTotalCol").textContent = currentLanguage === "en" ? "Total" : (currentLanguage === "ar" ? "کۆم" : "کۆم");

  // Items list
  let html = "";
  cart.forEach(cartItem => {
    let name = cartItem.item.nameEN;
    if (currentLanguage === "ku") name = cartItem.item.nameKU || cartItem.item.nameEN;
    else if (currentLanguage === "ar") name = cartItem.item.nameAR || cartItem.item.nameEN;

    const totalItemPrice = cartItem.item.price * cartItem.quantity;
    html += `
      <div class="receipt-item-row">
        <span class="receipt-item-name">${cartItem.quantity}x ${name}</span>
        <span class="receipt-item-total">${totalItemPrice.toLocaleString()} IQD</span>
      </div>
    `;
  });
  document.getElementById("receiptItemsList").innerHTML = html;

  // Total sum
  const totalPrice = cart.reduce((sum, current) => sum + (current.item.price * current.quantity), 0);
  document.getElementById("receiptTotalLabel").textContent = dict.totalLabel;
  document.getElementById("receiptTotalVal").textContent = `${totalPrice.toLocaleString()} IQD`;

  // Footer thanks message
  document.getElementById("receiptFooterNote").textContent = currentLanguage === "en" ? "Thank you for your visit!" : (currentLanguage === "ar" ? "شكراً لزيارتكم!" : "سوپاس بۆ سەرەدانا وە!");

  // Button translations
  document.getElementById("receiptConfirmSendBtnText").textContent = currentLanguage === "en" ? "Confirm & Send" : (currentLanguage === "ar" ? "تأكيد وإرسال" : "پشتڕاستکرن و فرێکرن");
  document.getElementById("receiptCancelBtnText").textContent = currentLanguage === "en" ? "Cancel" : (currentLanguage === "ar" ? "إلغاء" : "پاشگەزبوون");

  // Open the receipt modal backdrop
  document.getElementById("receiptModalBackdrop").classList.add("active");
}

// Actual WhatsApp sending function triggered by clicking Confirm on the Receipt modal
function confirmAndSendWhatsApp() {
  const noteVal = currentOrderNote || "-";
  const dict = translations[currentLanguage];

  if (cart.length === 0) {
    showToast(dict.emptyCartText);
    return;
  }

  // Format cart items text
  let itemsText = "";
  cart.forEach(cartItem => {
    let name = cartItem.item.nameEN;
    if (currentLanguage === "ku") name = cartItem.item.nameKU || cartItem.item.nameEN;
    else if (currentLanguage === "ar") name = cartItem.item.nameAR || cartItem.item.nameEN;

    itemsText += `- ${cartItem.quantity}x ${name} (${formatCurrency(cartItem.item.price * cartItem.quantity)})\n`;
  });

  const totalPrice = cart.reduce((sum, current) => sum + (current.item.price * current.quantity), 0);

  // Format template
  let template = dict.whatsappTemplate;
  let finalMessage = template
    .replace("{note}", noteVal)
    .replace("{items}", itemsText.trim())
    .replace("{total}", totalPrice.toLocaleString());

  // Encode message for URL
  const encodedText = encodeURIComponent(finalMessage);

  // Get WhatsApp number from database settings or fallback to default
  const rawNum = dbSettings.whatsappNumber || "07508244332";
  const formattedNum = formatWhatsAppNumber(rawNum);

  // Open WhatsApp window
  const whatsappUrl = `https://wa.me/${formattedNum}?text=${encodedText}`;
  window.open(whatsappUrl, "_blank");

  // Close receipt modal
  document.getElementById("receiptModalBackdrop").classList.remove("active");

  showToast(currentLanguage === "en" ? "Order submitted!" : (currentLanguage === "ar" ? "تم إرسال الطلب!" : "داواکاریا تە هاتە فرێکرن!"));
}

// Cancel / Close receipt modal without sending
function closeReceiptModalOnly() {
  document.getElementById("receiptModalBackdrop").classList.remove("active");
}

// Fallback for background click callback
function closeReceiptModal() {
  closeReceiptModalOnly();
}

// Clear cart button action
function clearCart() {
  cart = [];
  renderCart();
  const dict = translations[currentLanguage];
  showToast(currentLanguage === "en" ? "Basket cleared" : (currentLanguage === "ar" ? "تم تفريغ السلة" : "سەبەتە هاتە پاککرن"));
}

// Custom Toast notification popups
function showCartToast(itemId) {
  const item = dbItems.find(i => i.id === itemId);
  if (!item) return;

  const dict = translations[currentLanguage];
  let name = item.nameEN;
  if (currentLanguage === "ku") name = item.nameKU || item.nameEN;
  else if (currentLanguage === "ar") name = item.nameAR || item.nameEN;

  showToast(`${name} ➔ ${dict.addedToCart}`);
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-color)"></i> <span>${message}</span>`;

  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, 2500);
}

// Synchronize across multiple open tabs automatically
window.addEventListener("storage", async (e) => {
  if (e.key === "saman_settings" || e.key === "saman_categories" || e.key === "saman_items") {
    await loadData();
    setLanguage(currentLanguage); // Refresh names and translations immediately
    // تاقیکردنەڤا گرێدانا فایربەیس
    if (window.app) {
      console.log("پیرۆزە! وێبسایت ب سەرکەفتی ب فایربەیس ڤە گرێدایە:", window.app);
    } else {
      console.log("ئەڕۆر: فایربەیس نەهاتیە گرێدان!");
    }
  }
});

// Expose functions globally for inline HTML events
window.setLanguage = setLanguage;
window.handleSearch = handleSearch;
window.selectCategory = selectCategory;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.toggleCartModal = toggleCartModal;
window.sendOrder = sendOrder;
window.confirmAndSendWhatsApp = confirmAndSendWhatsApp;
window.closeReceiptModalOnly = closeReceiptModalOnly;
window.closeReceiptModal = closeReceiptModal;
window.clearCart = clearCart;
