// Administration Control Script for Saman Cafeteria

let dbSettings = {};
let dbCategories = [];
let dbItems = [];
let adminLang = localStorage.getItem("saman_admin_lang") || "en";

// ===== Admin Panel Translation Dictionary =====
const adminTranslations = {
  en: {
    dashboardBadge: "Admin Dashboard",
    logoutBtn: "Logout",
    tabCategories: "Categories",
    tabItems: "Items",
    tabSettings: "Settings",
    // Categories
    catFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> Add New Category',
    catFormHeaderEdit: '<i class="fa-solid fa-edit"></i> Edit Category',
    catNameENLabel: "Category Name (English)",
    catNameARLabel: "Category Name (Arabic)",
    catNameKULabel: "Category Name (Kurdish Badini)",
    catImageLabel: "Category Image",
    catUploadText: "Click to Upload Image",
    catSubmitAdd: '<i class="fa-solid fa-check"></i> Add Category',
    catSubmitEdit: '<i class="fa-solid fa-check"></i> Save Changes',
    catCancelBtn: "Cancel",
    currentCategoriesTitle: '<i class="fa-solid fa-list"></i> Current Categories',
    // Items
    itemFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> Add New Item',
    itemFormHeaderEdit: '<i class="fa-solid fa-edit"></i> Edit Item',
    selectCategoryLabel: "Select Category",
    itemNameENLabel: "Item Name (English)",
    itemPriceLabel: "Price (IQD)",
    itemNameARLabel: "Item Name (Arabic)",
    itemNameKULabel: "Item Name (Kurdish Badini)",
    itemDescENLabel: "Description (English)",
    itemDescARLabel: "Description (Arabic)",
    itemDescKULabel: "Description (Kurdish Badini)",
    itemImageLabel: "Item Image",
    itemUploadText: "Click to Upload Image",
    itemSubmitAdd: '<i class="fa-solid fa-check"></i> Add Item',
    itemSubmitEdit: '<i class="fa-solid fa-check"></i> Save Changes',
    itemCancelBtn: "Cancel Edit",
    itemsListTitle: '<i class="fa-solid fa-cubes"></i> Items List',
    allCategoriesFilter: "All Categories",
    // Settings
    settingsTitle: '<i class="fa-solid fa-gears"></i> General Settings',
    settingsDesc: "Manage your branding, cafeteria details, and the 3-second rotating top slider images here.",
    cafeNameSectionTitle: '<i class="fa-solid fa-mug-hot"></i> Cafeteria Name Customization',
    cafeNameSectionDesc: "Edit the Cafeteria Name displayed on the menu for each language.",
    cafeNameENLabel: "Cafeteria Name (English)",
    cafeNameARLabel: "Cafeteria Name (Arabic)",
    cafeNameKULabel: "Cafeteria Name (Kurdish Badini)",
    whatsappSectionTitle: '<i class="fa-brands fa-whatsapp"></i> WhatsApp Order Number',
    whatsappSectionDesc: "Set the WhatsApp phone number where customer orders will be sent.",
    whatsappLabel: "WhatsApp Number (e.g. 07508244332)",
    logoSectionTitle: '<i class="fa-solid fa-circle-user"></i> Logo Customization',
    logoSectionDesc: "This logo will display in the circular container at the top of the menu.",
    changeLogoBtn: '<i class="fa-solid fa-image"></i> Change Logo Image',
    bgSectionTitle: '<i class="fa-solid fa-images"></i> Background Slideshow',
    bgSectionDesc: "Upload the 3 background images that transition every 3 seconds on the top image slider.",
    bgSlideLabel: "Background Slide",
    saveSettingsBtn: '<i class="fa-solid fa-floppy-disk"></i> Save Settings',
    // Actions
    editBtn: "Edit",
    deleteBtn: "Delete",
    confirmDelete: "Are you sure you want to delete this?",
    loginTitle: "Admin Authorization",
    usernameLabel: "Username",
    passwordLabel: "Password",
    loginBtn: "Login"
  },
  ku: {
    dashboardBadge: "پەنێلا ئەدمین",
    logoutBtn: "دەرکەوتن",
    tabCategories: "بەشەکان",
    tabItems: "بابەتەکان",
    tabSettings: "ڕێکخستن",
    catFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> بەشێکی نوو زێدەبکە',
    catFormHeaderEdit: '<i class="fa-solid fa-edit"></i> بەشەکە بگۆڕە',
    catNameENLabel: "ناوێ بەشی (ئینگلیزی)",
    catNameARLabel: "ناوێ بەشی (عەرەبی)",
    catNameKULabel: "ناوێ بەشی (کوردی بادینی)",
    catImageLabel: "وێنەیا بەشی",
    catUploadText: "کلیک بکە بۆ بارکرنا وێنەیێ",
    catSubmitAdd: '<i class="fa-solid fa-check"></i> بەشەکە زێدەبکە',
    catSubmitEdit: '<i class="fa-solid fa-check"></i> گۆڕانکاریان تۆمار بکە',
    catCancelBtn: "پاشگەزبوون",
    currentCategoriesTitle: '<i class="fa-solid fa-list"></i> بەشێن هەبوون',
    itemFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> بابەتێکی نوو زێدەبکە',
    itemFormHeaderEdit: '<i class="fa-solid fa-edit"></i> بابەتەکە بگۆڕە',
    selectCategoryLabel: "بەشەکە هەلبژێرە",
    itemNameENLabel: "ناوێ بابەتی (ئینگلیزی)",
    itemPriceLabel: "نرخ (IQD)",
    itemNameARLabel: "ناوێ بابەتی (عەرەبی)",
    itemNameKULabel: "ناوێ بابەتی (کوردی بادینی)",
    itemDescENLabel: "وەسف (ئینگلیزی)",
    itemDescARLabel: "وەسف (عەرەبی)",
    itemDescKULabel: "وەسف (کوردی بادینی)",
    itemImageLabel: "وێنەیا بابەتی",
    itemUploadText: "کلیک بکە بۆ بارکرنا وێنەیێ",
    itemSubmitAdd: '<i class="fa-solid fa-check"></i> بابەتەکە زێدەبکە',
    itemSubmitEdit: '<i class="fa-solid fa-check"></i> گۆڕانکاریان تۆمار بکە',
    itemCancelBtn: "پاشگەزبوون",
    itemsListTitle: '<i class="fa-solid fa-cubes"></i> لیستا بابەتان',
    allCategoriesFilter: "هەمی بەشەکان",
    settingsTitle: '<i class="fa-solid fa-gears"></i> ڕێکخستنا گشتی',
    settingsDesc: "ناوێ کافتریایە، لۆگۆ، وێنەکانی سلایدەر و ژمارەی واتساپ لێرە بگۆڕە.",
    cafeNameSectionTitle: '<i class="fa-solid fa-mug-hot"></i> گۆڕینا ناوێ کافتریایێ',
    cafeNameSectionDesc: "ناوێ کافتریایێ ل سەر مێنویێ بۆ هەر زمانەکی بگۆڕە.",
    cafeNameENLabel: "ناوێ کافتریایێ (ئینگلیزی)",
    cafeNameARLabel: "ناوێ کافتریایێ (عەرەبی)",
    cafeNameKULabel: "ناوێ کافتریایێ (کوردی بادینی)",
    whatsappSectionTitle: '<i class="fa-brands fa-whatsapp"></i> ژمارەیا واتساپ بۆ داواکاریان',
    whatsappSectionDesc: "ژمارەیا تەلەفونا واتساپ دابنێ کو داواکاریێن موشتەریان بهێنە شاندن.",
    whatsappLabel: "ژمارەیا واتساپ (وەک 07508244332)",
    logoSectionTitle: '<i class="fa-solid fa-circle-user"></i> گۆڕینا لۆگۆیێ',
    logoSectionDesc: "ئەڤ لۆگۆیە دی خۆ نیشان بدەت ل باسکا گۆلەکی ل سەرێ مێنویێ.",
    changeLogoBtn: '<i class="fa-solid fa-image"></i> وێنەیا لۆگۆیێ بگۆڕە',
    bgSectionTitle: '<i class="fa-solid fa-images"></i> سلایدشۆوا پاشبنەما',
    bgSectionDesc: "٣ وێنەیێن پاشبنەمایێ بار بکە کو هەر ٣ چرکەیان دگۆڕن ل سەرەکی سلایدەرێ.",
    bgSlideLabel: "سلایدا پاشبنەما",
    saveSettingsBtn: '<i class="fa-solid fa-floppy-disk"></i> ڕێکخستنان تۆمار بکە',
    editBtn: "گۆڕین",
    deleteBtn: "ژێبرن",
    confirmDelete: "تو دڵنیایی دەڤێت ئەڤ ژێ ببی؟",
    loginTitle: "دەستوورنامەیا ئەدمین",
    usernameLabel: "ناوێ بکارهێنەر",
    passwordLabel: "وشەیا نهێنی",
    loginBtn: "چوونەژوور"
  },
  ar: {
    dashboardBadge: "لوحة الإدارة",
    logoutBtn: "تسجيل خروج",
    tabCategories: "الأقسام",
    tabItems: "العناصر",
    tabSettings: "الإعدادات",
    catFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> إضافة قسم جديد',
    catFormHeaderEdit: '<i class="fa-solid fa-edit"></i> تعديل القسم',
    catNameENLabel: "اسم القسم (الإنجليزية)",
    catNameARLabel: "اسم القسم (العربية)",
    catNameKULabel: "اسم القسم (كردي بادیني)",
    catImageLabel: "صورة القسم",
    catUploadText: "انقر لرفع صورة",
    catSubmitAdd: '<i class="fa-solid fa-check"></i> إضافة القسم',
    catSubmitEdit: '<i class="fa-solid fa-check"></i> حفظ التغييرات',
    catCancelBtn: "إلغاء",
    currentCategoriesTitle: '<i class="fa-solid fa-list"></i> الأقسام الحالية',
    itemFormHeaderAdd: '<i class="fa-solid fa-plus-circle"></i> إضافة عنصر جديد',
    itemFormHeaderEdit: '<i class="fa-solid fa-edit"></i> تعديل العنصر',
    selectCategoryLabel: "اختر القسم",
    itemNameENLabel: "اسم العنصر (الإنجليزية)",
    itemPriceLabel: "السعر (IQD)",
    itemNameARLabel: "اسم العنصر (العربية)",
    itemNameKULabel: "اسم العنصر (كردي بادیني)",
    itemDescENLabel: "الوصف (الإنجليزية)",
    itemDescARLabel: "الوصف (العربية)",
    itemDescKULabel: "الوصف (كردي بادیني)",
    itemImageLabel: "صورة العنصر",
    itemUploadText: "انقر لرفع صورة",
    itemSubmitAdd: '<i class="fa-solid fa-check"></i> إضافة العنصر',
    itemSubmitEdit: '<i class="fa-solid fa-check"></i> حفظ التغييرات',
    itemCancelBtn: "إلغاء التعديل",
    itemsListTitle: '<i class="fa-solid fa-cubes"></i> قائمة العناصر',
    allCategoriesFilter: "جميع الأقسام",
    settingsTitle: '<i class="fa-solid fa-gears"></i> الإعدادات العامة',
    settingsDesc: "إدارة العلامة التجارية وتفاصيل المقهى وصور السلايدر الدوارة.",
    cafeNameSectionTitle: '<i class="fa-solid fa-mug-hot"></i> تخصيص اسم المقهى',
    cafeNameSectionDesc: "عدّل اسم المقهى المعروض في القائمة لكل لغة.",
    cafeNameENLabel: "اسم المقهى (الإنجليزية)",
    cafeNameARLabel: "اسم المقهى (العربية)",
    cafeNameKULabel: "اسم المقهى (كردي بادیني)",
    whatsappSectionTitle: '<i class="fa-brands fa-whatsapp"></i> رقم واتساب الطلبات',
    whatsappSectionDesc: "حدد رقم واتساب الذي سيتم إرسال طلبات الزبائن إليه.",
    whatsappLabel: "رقم واتساب (مثال: 07508244332)",
    logoSectionTitle: '<i class="fa-solid fa-circle-user"></i> تخصيص الشعار',
    logoSectionDesc: "سيظهر هذا الشعار في الدائرة أعلى القائمة.",
    changeLogoBtn: '<i class="fa-solid fa-image"></i> تغيير صورة الشعار',
    bgSectionTitle: '<i class="fa-solid fa-images"></i> عرض الشرائح الخلفية',
    bgSectionDesc: "ارفع ٣ صور خلفية تتبدل كل ٣ ثوانٍ في الشريط العلوي.",
    bgSlideLabel: "شريحة خلفية",
    saveSettingsBtn: '<i class="fa-solid fa-floppy-disk"></i> حفظ الإعدادات',
    editBtn: "تعديل",
    deleteBtn: "حذف",
    confirmDelete: "هل أنت متأكد من الحذف؟",
    loginTitle: "تسجيل دخول الإدارة",
    usernameLabel: "اسم المستخدم",
    passwordLabel: "كلمة المرور",
    loginBtn: "دخول"
  }
};

// Change admin language
function changeAdminLanguage(lang) {
  adminLang = lang;
  localStorage.setItem("saman_admin_lang", lang);

  // Set text direction
  if (lang === "ku" || lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", lang);
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  }

  applyAdminLanguage();
}

// Apply translations to all admin panel elements
function applyAdminLanguage() {
  const t = adminTranslations[adminLang];

  // Header
  const badge = document.querySelector(".dash-title .badge");
  if (badge) badge.textContent = t.dashboardBadge;
  const logoutText = document.getElementById("logoutBtnText");
  if (logoutText) logoutText.textContent = t.logoutBtn;

  const headerTitle = document.querySelector(".dash-title h1");
  if (headerTitle) {
    let name = dbSettings.cafeNameEN || "Saman Cafeteria";
    if (adminLang === "ku") name = dbSettings.cafeNameKU || dbSettings.cafeNameEN || name;
    else if (adminLang === "ar") name = dbSettings.cafeNameAR || dbSettings.cafeNameEN || name;
    headerTitle.textContent = name;
  }

  // Nav tabs
  const tabBtns = document.querySelectorAll(".tab-link span");
  if (tabBtns.length >= 3) {
    tabBtns[0].textContent = t.tabCategories;
    tabBtns[1].textContent = t.tabItems;
    tabBtns[2].textContent = t.tabSettings;
  }

  // === Categories Tab ===
  const catFormHeader = document.getElementById("catFormHeader");
  const editCatId = document.getElementById("editCategoryId");
  if (catFormHeader) {
    catFormHeader.innerHTML = (editCatId && editCatId.value) ? t.catFormHeaderEdit : t.catFormHeaderAdd;
  }

  // Category form labels
  const catLabels = document.querySelectorAll("#categoryForm .input-field label");
  if (catLabels.length >= 4) {
    catLabels[0].textContent = t.catNameENLabel;
    catLabels[1].textContent = t.catNameARLabel;
    catLabels[2].textContent = t.catNameKULabel;
    catLabels[3].textContent = t.catImageLabel;
  }
  const catUploadSpan = document.querySelector("#catUploadPlaceholder span");
  if (catUploadSpan) catUploadSpan.textContent = t.catUploadText;

  const catSubmitBtn = document.getElementById("catSubmitBtn");
  if (catSubmitBtn) {
    catSubmitBtn.innerHTML = (editCatId && editCatId.value) ? t.catSubmitEdit : t.catSubmitAdd;
  }
  const catCancelBtn = document.getElementById("catCancelBtn");
  if (catCancelBtn) catCancelBtn.textContent = t.catCancelBtn;

  const catListTitle = document.querySelector("#categoriesTab .list-card h2");
  if (catListTitle) catListTitle.innerHTML = t.currentCategoriesTitle;

  // === Items Tab ===
  const itemFormHeader = document.getElementById("itemFormHeader");
  const editItemId = document.getElementById("editItemId");
  if (itemFormHeader) {
    itemFormHeader.innerHTML = (editItemId && editItemId.value) ? t.itemFormHeaderEdit : t.itemFormHeaderAdd;
  }

  // Item form labels
  const itemForm = document.getElementById("itemForm");
  if (itemForm) {
    const itemLabels = itemForm.querySelectorAll(".input-field label");
    if (itemLabels.length >= 9) {
      itemLabels[0].textContent = t.selectCategoryLabel;
      itemLabels[1].textContent = t.itemNameENLabel;
      itemLabels[2].textContent = t.itemPriceLabel;
      itemLabels[3].textContent = t.itemNameARLabel;
      itemLabels[4].textContent = t.itemNameKULabel;
      itemLabels[5].textContent = t.itemDescENLabel;
      itemLabels[6].textContent = t.itemDescARLabel;
      itemLabels[7].textContent = t.itemDescKULabel;
      itemLabels[8].textContent = t.itemImageLabel;
    }
  }
  const itemUploadSpan = document.querySelector("#itemUploadPlaceholder span");
  if (itemUploadSpan) itemUploadSpan.textContent = t.itemUploadText;

  const itemSubmitBtn = document.getElementById("itemSubmitBtn");
  if (itemSubmitBtn) {
    itemSubmitBtn.innerHTML = (editItemId && editItemId.value) ? t.itemSubmitEdit : t.itemSubmitAdd;
  }
  const itemCancelBtn = document.getElementById("itemCancelBtn");
  if (itemCancelBtn) itemCancelBtn.textContent = t.itemCancelBtn;

  const itemsListTitle = document.querySelector("#itemsTab .list-card h2");
  if (itemsListTitle) itemsListTitle.innerHTML = t.itemsListTitle;

  const filterSelect = document.getElementById("itemFilterSelect");
  if (filterSelect && filterSelect.options.length > 0) {
    filterSelect.options[0].textContent = t.allCategoriesFilter;
  }

  // === Settings Tab ===
  const settingsCard = document.querySelector(".settings-card");
  if (settingsCard) {
    const settingsH2 = settingsCard.querySelector("h2");
    if (settingsH2) settingsH2.innerHTML = t.settingsTitle;
    const settingsP = settingsCard.querySelector(".section-desc");
    if (settingsP) settingsP.textContent = t.settingsDesc;
  }

  const settingsBoxes = document.querySelectorAll(".settings-box");
  if (settingsBoxes.length >= 4) {
    // Cafe name box
    settingsBoxes[0].querySelector("h3").innerHTML = t.cafeNameSectionTitle;
    settingsBoxes[0].querySelector("p").textContent = t.cafeNameSectionDesc;
    const cafeLabels = settingsBoxes[0].querySelectorAll("label");
    if (cafeLabels.length >= 3) {
      cafeLabels[0].textContent = t.cafeNameENLabel;
      cafeLabels[1].textContent = t.cafeNameARLabel;
      cafeLabels[2].textContent = t.cafeNameKULabel;
    }

    // WhatsApp box
    settingsBoxes[1].querySelector("h3").innerHTML = t.whatsappSectionTitle;
    settingsBoxes[1].querySelector("p").textContent = t.whatsappSectionDesc;
    const whatsLabel = settingsBoxes[1].querySelector("label");
    if (whatsLabel) whatsLabel.textContent = t.whatsappLabel;

    // Logo box
    settingsBoxes[2].querySelector("h3").innerHTML = t.logoSectionTitle;
    settingsBoxes[2].querySelector("p").textContent = t.logoSectionDesc;
    const logoLabel = settingsBoxes[2].querySelector(".setting-upload-btn");
    if (logoLabel) logoLabel.innerHTML = t.changeLogoBtn;

    // Background box
    settingsBoxes[3].querySelector("h3").innerHTML = t.bgSectionTitle;
    settingsBoxes[3].querySelector("p").textContent = t.bgSectionDesc;
    const slideLabels = settingsBoxes[3].querySelectorAll(".slide-upload-controls label");
    slideLabels.forEach((lbl, i) => {
      if (!lbl.getAttribute("for")) {
        lbl.textContent = `${t.bgSlideLabel} ${i + 1}`;
      }
    });
  }

  const saveBtn = document.querySelector(".save-settings-btn");
  if (saveBtn) saveBtn.innerHTML = t.saveSettingsBtn;

  // Login card
  const loginAuthTitle = document.querySelector(".login-header p");
  if (loginAuthTitle) loginAuthTitle.textContent = t.loginTitle;
  const loginLabels = document.querySelectorAll("#loginForm .input-field label");
  if (loginLabels.length >= 2) {
    loginLabels[0].textContent = t.usernameLabel;
    loginLabels[1].textContent = t.passwordLabel;
  }
  const loginBtnSpan = document.querySelector(".login-btn span");
  if (loginBtnSpan) loginBtnSpan.textContent = t.loginBtn;

  // Set selector value
  const langSelector = document.getElementById("adminLangSelector");
  if (langSelector) langSelector.value = adminLang;

  // Re-render list items with translated edit/delete buttons
  renderCategoriesList();
  renderItemsList();
}

// Initialize Page
document.addEventListener("DOMContentLoaded", async () => {
  // Check session authorization
  const isLoggedIn = sessionStorage.getItem("saman_admin_logged") === "true";

  // Apply saved admin language direction
  changeAdminLanguage(adminLang);

  // Load data from DB service
  await loadDashboardData();

  // Hide loading overlay with transition
  setTimeout(() => {
    const loader = document.getElementById("loaderOverlay");
    if (loader) loader.classList.add("fade-out");

    if (isLoggedIn) {
      showDashboard();
    } else {
      showLogin();
    }
  }, 1000);
});

// Update dynamic branding elements (logos, titles) on login and loader
function updateDynamicBranding() {
  const cafeNameEN = dbSettings.cafeNameEN || "Saman Cafeteria";

  // Update titles
  const loaderCafeName = document.getElementById("loaderCafeName");
  if (loaderCafeName) {
    loaderCafeName.textContent = cafeNameEN.toUpperCase();
  }
  const loginCafeName = document.getElementById("loginCafeName");
  if (loginCafeName) {
    loginCafeName.textContent = cafeNameEN;
  }

  // Update dashboard header title
  const headerTitle = document.querySelector(".dash-title h1");
  if (headerTitle) {
    let name = dbSettings.cafeNameEN || "Saman Cafeteria";
    if (adminLang === "ku") name = dbSettings.cafeNameKU || dbSettings.cafeNameEN || name;
    else if (adminLang === "ar") name = dbSettings.cafeNameAR || dbSettings.cafeNameEN || name;
    headerTitle.textContent = name;
  }

  // Update header logo
  const dashLogo = document.getElementById("dashLogo");
  if (dashLogo && dbSettings.logo) {
    dashLogo.src = dbSettings.logo;
  }

  // Update loading logo
  const loaderLogoIcon = document.getElementById("loaderLogoIcon");
  const loaderLogoImg = document.getElementById("loaderLogoImg");
  if (dbSettings.logo) {
    if (loaderLogoIcon) loaderLogoIcon.classList.add("hidden");
    if (loaderLogoImg) {
      loaderLogoImg.src = dbSettings.logo;
      loaderLogoImg.classList.remove("hidden");
    }
  } else {
    if (loaderLogoIcon) loaderLogoIcon.classList.remove("hidden");
    if (loaderLogoImg) loaderLogoImg.classList.add("hidden");
  }

  // Update login logo
  const loginLogoIcon = document.getElementById("loginLogoIcon");
  const loginLogoImg = document.getElementById("loginLogoImg");
  if (dbSettings.logo) {
    if (loginLogoIcon) loginLogoIcon.classList.add("hidden");
    if (loginLogoImg) {
      loginLogoImg.src = dbSettings.logo;
      loginLogoImg.classList.remove("hidden");
    }
  } else {
    if (loginLogoIcon) loginLogoIcon.classList.remove("hidden");
    if (loginLogoImg) loginLogoImg.classList.add("hidden");
  }
}

// Load DB elements
async function loadDashboardData() {
  try {
    dbSettings = await window.dbService.getSettings();

    // Update logos and titles based on the fetched settings
    updateDynamicBranding();

    dbCategories = await window.dbService.getCategories();
    dbItems = await window.dbService.getItems();

    // Populate Category dropdown lists
    populateCategoryDropdowns();

    // Render list items
    renderCategoriesList();
    renderItemsList();
    renderSettingsPanel();

    // Apply translations after rendering
    applyAdminLanguage();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    showToast("error", "Error loading database values");
  }
}

// Display Login Card
function showLogin() {
  document.getElementById("loginWrapper").classList.remove("hidden");
  document.getElementById("dashboardWrapper").classList.add("hidden");
}

// Display Dashboard Panel
function showDashboard() {
  document.getElementById("loginWrapper").classList.add("hidden");
  document.getElementById("dashboardWrapper").classList.remove("hidden");

  // Set top logo and title
  const dashLogo = document.getElementById("dashLogo");
  if (dashLogo && dbSettings.logo) {
    dashLogo.src = dbSettings.logo;
  }

  const headerTitle = document.querySelector(".dash-title h1");
  if (headerTitle) {
    let name = dbSettings.cafeNameEN || "Saman Cafeteria";
    if (adminLang === "ku") name = dbSettings.cafeNameKU || dbSettings.cafeNameEN || name;
    else if (adminLang === "ar") name = dbSettings.cafeNameAR || dbSettings.cafeNameEN || name;
    headerTitle.textContent = name;
  }
}

// Login Handler
function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const alertBox = document.getElementById("loginAlert");

  if (user === "hama" && pass === "12345") {
    alertBox.style.display = "none";
    sessionStorage.setItem("saman_admin_logged", "true");

    showDashboard();
    showToast("success", "Welcome back, hama!");
  } else {
    alertBox.style.display = "block";
    showToast("error", "Invalid authorization credentials");
  }
}

// Logout Handler
function handleLogout() {
  sessionStorage.removeItem("saman_admin_logged");
  showToast("success", "Logged out successfully");
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// Navigation Tabs Router
function switchTab(tabId, event) {
  // Reset active classes
  document.querySelectorAll(".tab-link").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));

  // Set active tab
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  } else {
    // Fallback: find the button that targets this tab
    document.querySelectorAll(".tab-link").forEach(btn => {
      if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(tabId)) {
        btn.classList.add("active");
      }
    });
  }
  document.getElementById(tabId).classList.add("active");
}

// File Upload Preview
function previewUpload(input, previewId) {
  const file = input.files[0];
  const preview = document.getElementById(previewId);
  const placeholder = input.nextElementSibling; // The upload placeholder div

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      if (placeholder && placeholder.classList.contains("upload-placeholder")) {
        placeholder.classList.add("hidden");
      }
    };
    reader.readAsDataURL(file);
  }
}

// Settings Specific Previews
function previewSettingsUpload(input, previewId) {
  const file = input.files[0];
  const preview = document.getElementById(previewId);
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Populate Add Item dropdown elements
function populateCategoryDropdowns() {
  const selectAdd = document.getElementById("itemCategorySelect");
  const selectFilter = document.getElementById("itemFilterSelect");

  if (!selectAdd || !selectFilter) return;

  let optionsHtml = `<option value="" disabled selected>Choose Category</option>`;
  let filterHtml = `<option value="all">All Categories</option>`;

  dbCategories.forEach(cat => {
    optionsHtml += `<option value="${cat.id}">${cat.nameEN} / ${cat.nameKU}</option>`;
    filterHtml += `<option value="${cat.id}">${cat.nameEN}</option>`;
  });

  selectAdd.innerHTML = optionsHtml;
  selectFilter.innerHTML = filterHtml;
}

// Save Category Handler
async function saveCategory(event) {
  event.preventDefault();
  const editId = document.getElementById("editCategoryId").value;
  const nameEN = document.getElementById("catNameEN").value.trim();
  const nameAR = document.getElementById("catNameAR").value.trim();
  const nameKU = document.getElementById("catNameKU").value.trim();
  const imageFile = document.getElementById("catImageFile").files[0];

  const submitBtn = document.getElementById("catSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

  try {
    let imageUrl = "";

    // If updating and no new image file was provided, preserve old image
    if (editId) {
      const existingCat = dbCategories.find(c => c.id === editId);
      imageUrl = existingCat ? existingCat.image : "";
    }

    if (imageFile) {
      imageUrl = await window.dbService.uploadImage(imageFile, "categories");
    }

    const catData = {
      nameEN,
      nameAR,
      nameKU,
      image: imageUrl
    };

    if (editId) {
      // Update existing category
      await window.dbService.updateCategory(editId, catData);
      showToast("success", "Category updated successfully!");
    } else {
      // Create new category
      await window.dbService.addCategory(catData);
      showToast("success", "Category created successfully!");
    }

    cancelCategoryEdit(); // Reset form and mode
    await loadDashboardData();
  } catch (error) {
    console.error("Save Category Error:", error);
    showToast("error", "Error saving category.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Add Category`;
  }
}

// Edit Category trigger
function editCategory(id) {
  const cat = dbCategories.find(c => c.id === id);
  if (!cat) return;

  // Set form fields
  document.getElementById("editCategoryId").value = cat.id;
  document.getElementById("catNameEN").value = cat.nameEN;
  document.getElementById("catNameAR").value = cat.nameAR || "";
  document.getElementById("catNameKU").value = cat.nameKU || "";

  // Show preview image
  const preview = document.getElementById("catImagePreview");
  const placeholder = document.getElementById("catUploadPlaceholder");

  if (cat.image) {
    preview.src = cat.image;
    preview.classList.remove("hidden");
    placeholder.classList.add("hidden");
  } else {
    preview.classList.add("hidden");
    placeholder.classList.remove("hidden");
  }

  // Update UI headers
  document.getElementById("catFormHeader").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Category: ${cat.nameEN}`;
  document.getElementById("catSubmitBtn").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Changes`;
  document.getElementById("catCancelBtn").classList.remove("hidden");

  // Scroll form into view
  document.getElementById("categoryForm").scrollIntoView({ behavior: "smooth" });
}

// Cancel Category Editing mode
function cancelCategoryEdit() {
  document.getElementById("editCategoryId").value = "";
  document.getElementById("categoryForm").reset();

  document.getElementById("catImagePreview").classList.add("hidden");
  document.getElementById("catUploadPlaceholder").classList.remove("hidden");

  document.getElementById("catFormHeader").innerHTML = `<i class="fa-solid fa-plus-circle"></i> Add New Category`;
  document.getElementById("catSubmitBtn").innerHTML = `<i class="fa-solid fa-check"></i> Add Category`;
  document.getElementById("catCancelBtn").classList.add("hidden");
}

// Delete Category Handler
async function deleteCategory(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"? Deleting a category will also delete all items inside it!`)) {
    try {
      await window.dbService.deleteCategory(id);
      showToast("success", "Category and matching items deleted");
      await loadDashboardData();
    } catch (e) {
      showToast("error", "Failed to delete category");
    }
  }
}

// Render Category List Cells
function renderCategoriesList() {
  const container = document.getElementById("categoriesList");
  if (!container) return;
  const t = adminTranslations[adminLang];

  if (dbCategories.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">No categories found</div>`;
    return;
  }

  let html = "";
  dbCategories.forEach(cat => {
    const safeName = (cat.nameEN || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    html += `
      <div class="dash-item-card">
        <div class="dash-item-img">
          <img src="${cat.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150'}" alt="${safeName}">
        </div>
        <div class="dash-item-details">
          <span class="dash-item-name">${cat.nameEN}</span>
          <span style="font-size: 10px; color: var(--text-muted);">${cat.nameKU}</span>
        </div>
        <div class="dash-item-actions">
          <button class="dash-action-btn edit" onclick="editCategory('${cat.id}')">
            <i class="fa-solid fa-edit"></i> ${t.editBtn}
          </button>
          <button class="dash-action-btn delete" onclick="deleteCategory('${cat.id}', '${safeName}')">
            <i class="fa-solid fa-trash"></i> ${t.deleteBtn}
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Save Item Handler (handles both Add and Edit modes)
async function saveItem(event) {
  event.preventDefault();
  const editId = document.getElementById("editItemId").value;
  const categoryId = document.getElementById("itemCategorySelect").value;
  const nameEN = document.getElementById("itemNameEN").value.trim();
  const nameAR = document.getElementById("itemNameAR").value.trim();
  const nameKU = document.getElementById("itemNameKU").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const descriptionEN = document.getElementById("itemDescEN").value.trim();
  const descriptionAR = document.getElementById("itemDescAR").value.trim();
  const descriptionKU = document.getElementById("itemDescKU").value.trim();
  const imageFile = document.getElementById("itemImageFile").files[0];

  const submitBtn = document.getElementById("itemSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

  try {
    let imageUrl = "";

    // If updating and no new image file was provided, preserve old image
    if (editId) {
      const existingItem = dbItems.find(i => i.id === editId);
      imageUrl = existingItem ? existingItem.image : "";
    }

    if (imageFile) {
      imageUrl = await window.dbService.uploadImage(imageFile, "items");
    }

    const itemData = {
      categoryId,
      nameEN,
      nameAR,
      nameKU,
      price,
      descriptionEN,
      descriptionAR,
      descriptionKU,
      image: imageUrl
    };

    if (editId) {
      // Update existing item
      await window.dbService.updateItem(editId, itemData);
      showToast("success", "Item updated successfully!");
    } else {
      // Create new item
      await window.dbService.addItem(itemData);
      showToast("success", "Item created successfully!");
    }

    cancelItemEdit(); // Reset form and mode
    await loadDashboardData();
  } catch (error) {
    console.error("Save Item Error:", error);
    showToast("error", "Error saving item details.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Add Item`;
  }
}

// Edit Item trigger
function editItem(id) {
  const item = dbItems.find(i => i.id === id);
  if (!item) return;

  // Set form fields
  document.getElementById("editItemId").value = item.id;
  document.getElementById("itemCategorySelect").value = item.categoryId;
  document.getElementById("itemNameEN").value = item.nameEN;
  document.getElementById("itemNameAR").value = item.nameAR || "";
  document.getElementById("itemNameKU").value = item.nameKU || "";
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemDescEN").value = item.descriptionEN || "";
  document.getElementById("itemDescAR").value = item.descriptionAR || "";
  document.getElementById("itemDescKU").value = item.descriptionKU || "";

  // Show preview image
  const preview = document.getElementById("itemImagePreview");
  const placeholder = document.getElementById("itemUploadPlaceholder");

  if (item.image) {
    preview.src = item.image;
    preview.classList.remove("hidden");
    placeholder.classList.add("hidden");
  } else {
    preview.classList.add("hidden");
    placeholder.classList.remove("hidden");
  }

  // Update UI headers
  document.getElementById("itemFormHeader").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Item: ${item.nameEN}`;
  document.getElementById("itemSubmitBtn").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Changes`;
  document.getElementById("itemCancelBtn").classList.remove("hidden");

  // Scroll form into view for mobile devices
  document.getElementById("itemForm").scrollIntoView({ behavior: "smooth" });
}

// Cancel Editing mode
function cancelItemEdit() {
  document.getElementById("editItemId").value = "";
  document.getElementById("itemForm").reset();

  document.getElementById("itemImagePreview").classList.add("hidden");
  document.getElementById("itemUploadPlaceholder").classList.remove("hidden");

  document.getElementById("itemFormHeader").innerHTML = `<i class="fa-solid fa-plus-circle"></i> Add New Item`;
  document.getElementById("itemSubmitBtn").innerHTML = `<i class="fa-solid fa-check"></i> Add Item`;
  document.getElementById("itemCancelBtn").classList.add("hidden");
}

// Delete Item
async function deleteItem(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    try {
      await window.dbService.deleteItem(id);
      showToast("success", "Item deleted successfully!");
      await loadDashboardData();
    } catch (e) {
      showToast("error", "Failed to delete item");
    }
  }
}

// Render Item List Cards
function renderItemsList() {
  const container = document.getElementById("itemsList");
  const filterVal = document.getElementById("itemFilterSelect").value;
  if (!container) return;
  const t = adminTranslations[adminLang];

  let itemsToRender = dbItems;
  if (filterVal !== "all") {
    itemsToRender = dbItems.filter(i => i.categoryId === filterVal);
  }

  if (itemsToRender.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">No items found in category</div>`;
    return;
  }

  let html = "";
  itemsToRender.forEach(item => {
    const safeName = (item.nameEN || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    html += `
      <div class="dash-item-card">
        <div class="dash-item-img">
          <img src="${item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150'}" alt="${safeName}">
        </div>
        <div class="dash-item-details">
          <span class="dash-item-name">${item.nameEN}</span>
          <span class="dash-item-price">${item.price.toLocaleString()} IQD</span>
        </div>
        <div class="dash-item-actions">
          <button class="dash-action-btn edit" onclick="editItem('${item.id}')">
            <i class="fa-solid fa-edit"></i> ${t.editBtn}
          </button>
          <button class="dash-action-btn delete" onclick="deleteItem('${item.id}', '${safeName}')">
            <i class="fa-solid fa-trash"></i> ${t.deleteBtn}
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Filter Items list trigger
function filterItemsList() {
  renderItemsList();
}

// Render settings panel image previews
function renderSettingsPanel() {
  // Bind cafeteria names
  document.getElementById("settingsCafeNameEN").value = dbSettings.cafeNameEN || "";
  document.getElementById("settingsCafeNameAR").value = dbSettings.cafeNameAR || "";
  document.getElementById("settingsCafeNameKU").value = dbSettings.cafeNameKU || "";

  // Bind WhatsApp number
  document.getElementById("settingsWhatsappNumber").value = dbSettings.whatsappNumber || "07508244332";

  // Logo preview
  const logoPreview = document.getElementById("settingsLogoPreview");
  if (logoPreview && dbSettings.logo) {
    logoPreview.src = dbSettings.logo;
  }

  // Slide previews
  if (dbSettings.bgImages) {
    for (let i = 0; i < 3; i++) {
      const thumb = document.getElementById(`slideThumb${i}`);
      if (thumb && dbSettings.bgImages[i]) {
        thumb.src = dbSettings.bgImages[i];
      }
    }
  }
}

// Save Settings Form
async function saveSettings(event) {
  event.preventDefault();
  const saveBtn = document.querySelector(".save-settings-btn");
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

  try {
    const cafeNameEN = document.getElementById("settingsCafeNameEN").value.trim();
    const cafeNameAR = document.getElementById("settingsCafeNameAR").value.trim();
    const cafeNameKU = document.getElementById("settingsCafeNameKU").value.trim();
    const whatsappNumber = document.getElementById("settingsWhatsappNumber").value.trim();

    const logoFile = document.getElementById("logoUploadFile").files[0];
    const slideFiles = [
      document.getElementById("slideFile0").files[0],
      document.getElementById("slideFile1").files[0],
      document.getElementById("slideFile2").files[0]
    ];

    let newLogoUrl = dbSettings.logo;
    let newBgImages = [...(dbSettings.bgImages || [])];

    // Upload Logo if changed
    if (logoFile) {
      newLogoUrl = await window.dbService.uploadImage(logoFile, "branding");
    }

    // Upload background slider slides if changed
    for (let i = 0; i < 3; i++) {
      if (slideFiles[i]) {
        newBgImages[i] = await window.dbService.uploadImage(slideFiles[i], "backgrounds");
      }
    }

    const updatedSettings = {
      cafeNameEN,
      cafeNameAR,
      cafeNameKU,
      whatsappNumber,
      logo: newLogoUrl,
      bgImages: newBgImages
    };

    await window.dbService.updateSettings(updatedSettings);
    showToast("success", "Settings updated successfully!");

    // Refresh configurations
    await loadDashboardData();
  } catch (error) {
    console.error("Save settings failed:", error);
    showToast("error", "Failed to update configurations");
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Settings`;
  }
}

// Admin Panel Toast Notifications
function showToast(type, message) {
  const container = document.getElementById("adminToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;

  const icon = type === "success"
    ? `<i class="fa-solid fa-circle-check"></i>`
    : `<i class="fa-solid fa-circle-exclamation"></i>`;

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  // Remove toast
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Synchronize across multiple open tabs automatically
window.addEventListener("storage", async (e) => {
  if (e.key === "saman_settings" || e.key === "saman_categories" || e.key === "saman_items") {
    await loadDashboardData();
  }
});

// Expose functions globally for inline HTML events
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.changeAdminLanguage = changeAdminLanguage;
window.switchTab = switchTab;
window.previewUpload = previewUpload;
window.previewSettingsUpload = previewSettingsUpload;
window.saveCategory = saveCategory;
window.cancelCategoryEdit = cancelCategoryEdit;
window.saveItem = saveItem;
window.cancelItemEdit = cancelItemEdit;
window.filterItemsList = filterItemsList;
window.saveSettings = saveSettings;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.editItem = editItem;
window.deleteItem = deleteItem;

// ١. هینانی داتابەیسێ ژ فایلێ ڕێکخستنێ (کە پێشتر لە سەرەوە هاوردەکراوە)
// ٢. کاتێ کەرەستەیەک یان فۆڕمەک ل سەر لاپەڕەی تێتە کلیک کرن
// تێبینی: ل جهێ 'menuForm' ناسناما (ID) یا فۆڕما خۆ دابنێ ئەگەر یا جودا بیت
const myForm = document.getElementById('menuForm');

if (myForm) {
    myForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ڕێگری ل ڕیفرێشبوونا لاپەڕەی دکات

        // گرتنا نرخێن ژ لایێ بەکارهێنەری ڤە هاتینە نڤیسین
        // ل جهێ ڤان ID-یان، ناسنامێن دروست یێن Input-ێن خۆ دابنێ
        const foodName = document.getElementById('foodNameInput').value;
        const foodPrice = document.getElementById('foodPriceInput').value;
        const foodCategory = document.getElementById('foodCategorySelect').value;

        try {
            // ناردنا داتایان بۆ پۆلەکێ ب ناڤێ 'menu' د ناڤ Firestore دا
            const docRef = await window.db.collection("menu").add({
                name: foodName,
                price: Number(foodPrice), // گۆهرینا بهایی بۆ ژمارە
                category: foodCategory,
                createdAt: new Date()
            });

            console.log("داتا ب سەرکەفتوویی پاشکەوت بوو ب ناسناما: ", docRef.id);
            alert("خوارن یان بابەت ب سەرکەفتوویی زێدە بوو! 🎉");
            
            myForm.reset(); // پاقژکرنا فۆڕمێ پشتی ناردنێ
        } catch (error) {
            console.error("شاشیەک هەیە د ناردنا داتایان دا: ", error);
            alert("شاشیەک ڕویدا، کودی د کونسۆڵێ دا پشکنی بکه.");
        }
    });
}

// فەنکشنا تاقیکردنێ ب شێوازێ کۆن و سادە
function testAddData() {
    window.db.collection("menu").add({
        foodName: "کەبابێ تاقیکردنێ ب ڕێکا سادە",
        foodPrice: 6000,
        createdAt: new Date()
    })
    .then((docRef) => {
        console.log("داتا سەرکەفتوویی چوو! ID:", docRef.id);
        alert("پیرۆزە! داتا ب بێ کێشە چوو بۆ فایەربەیسێ! 🎉");
    })
    .catch((error) => {
        console.error("شاشی هەیە:", error);
    });
}

// ئێکسەر کارپێکرنا فەنکشنێ کاتێ لاپەڕە ڤەدبیت
testAddData();
