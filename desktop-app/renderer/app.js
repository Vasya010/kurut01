const $ = (id) => document.getElementById(id);

const loginView = $("loginView");
const dashboardView = $("dashboardView");

const loginForm = $("loginForm");
const loginBtn = $("loginBtn");
const loginSpinner = $("loginSpinner");
const loginError = $("loginError");
const emailErrorEl = $("emailError");
const passwordErrorEl = $("passwordError");

const emailInput = $("email");
const passwordInput = $("password");
const showPasswordBtn = $("showPasswordBtn");

const baseUrlInput = $("baseUrl");
const saveBaseUrlBtn = $("saveBaseUrlBtn");
const testBaseUrlBtn = $("testBaseUrlBtn");
const connectionStatusEl = $("connectionStatus");
const baseUrlSavedStatusEl = $("baseUrlSavedStatus");
const rememberEmailCheckbox = $("rememberEmail");

const logoutBtn = $("logoutBtn");
const refreshBtn = $("refreshBtn");
const openSettingsBtn = $("openSettingsBtn");
const settingsPanel = $("settingsPanel");
const settingsBackdrop = $("settingsBackdrop");
const settingsCloseBtn = $("settingsCloseBtn");

const themeModeSystemBtn = $("themeModeSystem");
const themeModeDarkBtn = $("themeModeDark");
const themeModeLightBtn = $("themeModeLight");
const systemThemePill = $("systemThemePill");

const autoRefreshEnabledInput = $("autoRefreshEnabled");
const autoRefreshIntervalSecSelect = $("autoRefreshIntervalSec");

const animationsEnabledInput = $("animationsEnabled");
const loadingOverlayEnabledInput = $("loadingOverlayEnabled");
const autoOpenLastTabInput = $("autoOpenLastTab");

const settingsLogoutBtn = $("settingsLogoutBtn");
const clearSavedEmailBtn = $("clearSavedEmailBtn");

const userNameEl = $("userName");
const userRoleEl = $("userRole");
const userAvatarEl = $("userAvatar");

const pageTitleEl = $("pageTitle");
const pageSubtitleEl = $("pageSubtitle");

const listingsTbody = $("listingsTbody");
const listingsEmpty = $("listingsEmpty");
const listingsError = $("listingsError");
const statCount = $("statCount");
const statToday = $("statToday");
const statPriceAvg = $("statPriceAvg");

const statsWrap = $("statsWrap");

const raionsTbody = $("raionsTbody");
const raionsEmpty = $("raionsEmpty");
const raionsError = $("raionsError");

const usersTbody = $("usersTbody");
const usersEmpty = $("usersEmpty");
const usersError = $("usersError");
const addUserBtn = $("addUserBtn");

const userEditorPanel = $("userEditorPanel");
const userEditorBackdrop = $("userEditorBackdrop");
const userEditorCloseBtn = $("userEditorCloseBtn");
const userEditorTitle = $("userEditorTitle");
const userEditorSubtitle = $("userEditorSubtitle");
const userEditorForm = $("userEditorForm");
const userEditorError = $("userEditorError");
const userEditorSubmitBtn = $("userEditorSubmitBtn");
const userEditorCancelBtn = $("userEditorCancelBtn");

const userEditorNameInput = $("userEditorName");
const userEditorRoleSelect = $("userEditorRole");
const userEditorEmailInput = $("userEditorEmail");
const userEditorPhoneInput = $("userEditorPhone");
const userEditorPasswordInput = $("userEditorPassword");
const userEditorPhotoInput = $("userEditorPhoto");

const variantsTbody = $("variantsTbody");
const variantsEmpty = $("variantsEmpty");
const variantsError = $("variantsError");

const variantsModeAllBtn = $("variantsModeAll");
const variantsModeMineBtn = $("variantsModeMine");
const variantsIdFilterInput = $("variantsIdFilter");
const applyVariantsFilterBtn = $("applyVariantsFilterBtn");
const resetVariantsFilterBtn = $("resetVariantsFilterBtn");
const toggleCreateVariantBtn = $("toggleCreateVariantBtn");

const createVariantPanel = $("createVariantPanel");
const createVariantForm = $("createVariantForm");
const cancelCreateVariantBtn = $("cancelCreateVariantBtn");
const cancelCreateVariantBtn2 = $("cancelCreateVariantBtn2");
const createVariantBackdrop = $("createVariantBackdrop");
const createVariantError = $("createVariantError");

const variantTypeSelect = $("variantType");
const variantPriceInput = $("variantPrice");
const variantRukPriceInput = $("variantRukPrice");
const variantMkvInput = $("variantMkv");
const variantAddressInput = $("variantAddress");
const variantEtajInput = $("variantEtaj");
const variantEtajnostInput = $("variantEtajnost");
const variantDistrictSelect = $("variantDistrict");
const variantSubdistrictSelect = $("variantSubdistrict");
const variantJkSelect = $("variantJk");
const variantCuratorSelect = $("variantCurator");
const variantOwnerNameInput = $("variantOwnerName");
const variantOwnerPhoneInput = $("variantOwnerPhone");
const variantPhoneInput = $("variantPhone");
const variantStatusInput = $("variantStatus");
const variantDescriptionInput = $("variantDescription");
const variantNotesInput = $("variantNotes");
const variantApartmentFields = $("variantApartmentFields");
const variantRepairInput = $("variantRepair");
const variantSeriesInput = $("variantSeries");
const variantRoomsInput = $("variantRooms");
const variantPricePerMkvHint = $("variantPricePerMkvHint");
const variantPhotosInput = $("variantPhotos");
const variantDocumentInput = $("variantDocument");

const variantsPanelSubtitle = $("variantsPanelSubtitle");

const variantDetailPanel = $("variantDetailPanel");
const variantDetailBackdrop = $("variantDetailBackdrop");
const variantDetailCloseBtn = $("variantDetailCloseBtn");
const variantDetailLoading = $("variantDetailLoading");
const variantDetailError = $("variantDetailError");
const variantDetailContent = $("variantDetailContent");
const variantDetailTitle = $("variantDetailTitle");
const variantDetailSubtitle = $("variantDetailSubtitle");
const variantDetailImg = $("variantDetailImg");
const variantDetailNoPhotos = $("variantDetailNoPhotos");
const variantDetailPrev = $("variantDetailPrev");
const variantDetailNext = $("variantDetailNext");
const variantDetailCounter = $("variantDetailCounter");
const variantDetailThumbs = $("variantDetailThumbs");
const variantDetailInfo = $("variantDetailInfo");
const variantDetailDocRow = $("variantDetailDocRow");
const variantDetailDocLink = $("variantDetailDocLink");

const toastHost = $("toastHost");

const loadingOverlay = $("loadingOverlay");
const loadingSubtitle = $("loadingSubtitle");

function showLoading(message) {
  if (!loadingOverlayEnabled) return;
  if (!loadingOverlay) return;
  loadingOverlay.classList.remove("hidden");
  if (loadingSubtitle) {
    loadingSubtitle.textContent = message || "Загрузка...";
  }
}

function hideLoading() {
  if (!loadingOverlayEnabled) return;
  if (!loadingOverlay) return;
  loadingOverlay.classList.add("hidden");
}

const navListingsBtn = $("navListings");
const navRaionsBtn = $("navRaions");
const navUsersBtn = $("navUsers");
const navTypesBtn = $("navTypes");

const viewListings = $("viewListings");
const viewRaions = $("viewRaions");
const viewUsers = $("viewUsers");
const viewTypes = $("viewTypes");

let activeTab = "listings";

// UI settings state (theme + автообновление)
let themeMode = "system"; // system | dark | light
let autoRefreshEnabled = false;
let autoRefreshIntervalSec = 60;
let autoRefreshTimer = null;

let animationsEnabled = true;
let loadingOverlayEnabled = true;
let autoOpenLastTab = true;
let lastTab = "listings";
let lastTabPersistTimer = null;

let authInvalid = false; // токен устарел; фоновые запросы не делаем

function systemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

if (typeof window !== "undefined" && window.matchMedia) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  // Update UI when OS theme changes and user is in "Система" mode.
  const handler = () => applyThemeMode(themeMode);
  if (mql.addEventListener) mql.addEventListener("change", handler);
  else if (mql.addListener) mql.addListener(handler);
}

function applyThemeMode(nextMode) {
  const mode = (nextMode || "system").toString().trim().toLowerCase();
  themeMode = mode;

  const effective = themeMode === "system" ? (systemPrefersDark() ? "dark" : "light") : themeMode;
  document.body.classList.toggle("theme-light", effective === "light");

  if (themeModeSystemBtn) themeModeSystemBtn.classList.toggle("active", themeMode === "system");
  if (themeModeDarkBtn) themeModeDarkBtn.classList.toggle("active", themeMode === "dark");
  if (themeModeLightBtn) themeModeLightBtn.classList.toggle("active", themeMode === "light");

  if (systemThemePill) {
    const sys = systemPrefersDark() ? "Тёмная" : "Светлая";
    if (themeMode === "system") {
      systemThemePill.textContent = `Система: ${sys}`;
    } else {
      systemThemePill.textContent = `Система: ${sys} (режим: ${themeMode === "dark" ? "Темная" : "Светлая"})`;
    }
  }
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

async function refreshForActiveTab() {
  if (activeTab === "listings") await renderListings();
  else if (activeTab === "raions") await renderRaions();
  else if (activeTab === "users") await renderUsers();
  else if (activeTab === "types") {
    applyVariantsToolbarForRole();
    await renderVariants();
  }
}

function startAutoRefreshIfNeeded() {
  stopAutoRefresh();
  if (!autoRefreshEnabled) return;
  const ms = Math.max(10, Number(autoRefreshIntervalSec || 60)) * 1000;
  autoRefreshTimer = setInterval(() => {
    // Background refresh; errors are ignored to keep UI stable.
    refreshForActiveTab().catch(() => {});
  }, ms);
}

function setHidden(el, hidden) {
  el.classList.toggle("hidden", hidden);
}

function showAlert(el, message) {
  el.textContent = message || "";
  setHidden(el, !message);
}

function shakeElement(el) {
  if (!el) return;
  el.classList.remove("shake");
  // Force reflow so animation restarts
  el.offsetWidth;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 320);
}

function setFieldError(inputEl, errorEl, message) {
  if (inputEl) inputEl.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message || "";
    setHidden(errorEl, !message);
  }
}

function clearFieldErrors() {
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
  if (emailErrorEl) {
    emailErrorEl.textContent = "";
    setHidden(emailErrorEl, true);
  }
  if (passwordErrorEl) {
    passwordErrorEl.textContent = "";
    setHidden(passwordErrorEl, true);
  }
}

function setButtonLoading(button, spinnerEl, loading) {
  button.disabled = !!loading;
  setHidden(spinnerEl, !loading);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(title, body, type = "default") {
  const el = document.createElement("div");
  el.className = `toast${type === "danger" ? " danger" : ""}`;

  const t = document.createElement("div");
  t.className = "toast-title";
  t.textContent = title;

  const b = document.createElement("div");
  b.className = "toast-body";
  b.textContent = body || "";

  el.appendChild(t);
  el.appendChild(b);
  toastHost.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    el.style.transition = "160ms ease";
  }, 2800);
  setTimeout(() => el.remove(), 3200);
}

function isEmailValid() {
  const v = emailInput.value.trim();
  if (!v) return false;
  return emailInput.checkValidity();
}

function isPasswordValid() {
  return passwordInput.value.trim().length > 0;
}

function updateLoginButtonState() {
  const ready = isEmailValid() && isPasswordValid();
  loginBtn.disabled = !ready;
}

function currentRuDateString() {
  return new Date().toLocaleDateString("ru-RU");
}

function computeUserAvatarInitials(user) {
  const name = (user && (user.name || user.first_name || user.last_name)) ? (user.name || "") : "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0] || ""}${parts[1][0] || ""}` : (parts[0]?.[0] || "U");
  return (initials || "U").toUpperCase().slice(0, 2);
}

async function loadSettings() {
  const {
    baseUrl,
    themeMode: tm,
    autoRefreshEnabled: are,
    autoRefreshIntervalSec: aris,
    rememberEmail,
    lastEmail,
    animationsEnabled: an,
    loadingOverlayEnabled: loe,
    autoOpenLastTab: aolt,
    lastTab: lt,
  } = await window.desktopApi.getSettings();
  baseUrlInput.value = baseUrl;
  applyThemeMode(tm || "system");

  autoRefreshEnabled = !!are;
  autoRefreshIntervalSec = Number(aris ?? 60);

  if (autoRefreshEnabledInput) autoRefreshEnabledInput.checked = autoRefreshEnabled;
  if (autoRefreshIntervalSecSelect) autoRefreshIntervalSecSelect.value = String(autoRefreshIntervalSec);

  animationsEnabled = an !== undefined ? !!an : true;
  loadingOverlayEnabled = loe !== undefined ? !!loe : true;
  autoOpenLastTab = aolt !== undefined ? !!aolt : true;
  lastTab = lt || "listings";

  if (animationsEnabledInput) animationsEnabledInput.checked = animationsEnabled;
  if (loadingOverlayEnabledInput) loadingOverlayEnabledInput.checked = loadingOverlayEnabled;
  if (autoOpenLastTabInput) autoOpenLastTabInput.checked = autoOpenLastTab;

  document.body.classList.toggle("no-animations", !animationsEnabled);

  if (rememberEmailCheckbox) {
    rememberEmailCheckbox.checked = !!rememberEmail;
    emailInput.value = rememberEmailCheckbox.checked ? String(lastEmail || "") : "";
  }
}

async function renderListings() {
  setHidden(listingsError, true);
  showAlert(listingsEmpty, "");
  listingsEmpty.classList.add("hidden");

  // Keep table visible while loading; just clear content.
  listingsTbody.innerHTML = "";

  try {
    const listings = await window.desktopApi.getListings();
    const safeListings = Array.isArray(listings) ? listings : [];

    setHidden(listingsError, true);
    setHidden(listingsEmpty, safeListings.length !== 0 ? true : false);

    statCount.textContent = String(safeListings.length);

    const today = currentRuDateString();
    const todayCount = safeListings.filter((x) => String(x.date || "") === today).length;
    statToday.textContent = String(todayCount);

    const prices = safeListings
      .map((x) => (x.price === null || x.price === undefined) ? NaN : Number(String(x.price).replace(",", ".")))
      .filter((n) => Number.isFinite(n));
    if (prices.length === 0) {
      statPriceAvg.textContent = "—";
    } else {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      statPriceAvg.textContent = avg.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
    }

    for (const row of safeListings) {
      const tr = document.createElement("tr");

      const priceText = row.price === null || row.price === undefined ? "—" : escapeHtml(row.price);
      const mkvText = row.area === null || row.area === undefined ? "—" : escapeHtml(row.area);
      const districtText = row.district === null || row.district === undefined ? "—" : escapeHtml(row.district);
      const statusText = row.status === null || row.status === undefined ? "—" : escapeHtml(row.status);

      tr.innerHTML = `
        <td>${escapeHtml(row.id)}</td>
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.time)}</td>
        <td>${districtText}</td>
        <td>${mkvText}</td>
        <td>${priceText}</td>
        <td>${statusText}</td>
      `;

      listingsTbody.appendChild(tr);
    }
  } catch (err) {
    if (err && err.status === 401) {
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      return;
    }
    const message = (err && err.message) ? err.message : "Ошибка загрузки данных";
    showAlert(listingsError, message);
    setHidden(listingsEmpty, true);
  }
}

async function renderRaions() {
  setHidden(raionsError, true);
  showAlert(raionsEmpty, "");
  raionsEmpty.classList.add("hidden");
  raionsTbody.innerHTML = "";

  try {
    const raions = await window.desktopApi.getRaions();
    const safe = Array.isArray(raions) ? raions : [];
    setHidden(raionsError, true);
    setHidden(raionsEmpty, safe.length === 0 ? false : true);

    if (safe.length === 0) return;

    for (const row of safe) {
      const tr = document.createElement("tr");
      const typeText = row.isRaion ? "Район" : "Подрайон";
      const parentText = row.parentRaionId == null ? "—" : escapeHtml(row.parentRaionId);
      tr.innerHTML = `
        <td>${escapeHtml(row.id)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(typeText)}</td>
        <td>${parentText}</td>
      `;
      raionsTbody.appendChild(tr);
    }
  } catch (err) {
    if (err && err.status === 401) {
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      return;
    }
    const message = (err && err.message) ? err.message : "Ошибка загрузки районов";
    showAlert(raionsError, message);
    setHidden(raionsEmpty, true);
  }
}

async function renderUsers() {
  setHidden(usersError, true);
  showAlert(usersEmpty, "");
  usersEmpty.classList.add("hidden");
  usersTbody.innerHTML = "";

  try {
    const users = await window.desktopApi.getUsers();
    const safe = Array.isArray(users) ? users : [];
    setHidden(usersError, true);
    setHidden(usersEmpty, safe.length === 0 ? false : true);

    if (safe.length === 0) return;

    const isSuper = dashboardUser && dashboardUser.role === "SUPER_ADMIN";
    if (addUserBtn) addUserBtn.classList.toggle("hidden", !isSuper);

    for (const user of safe) {
      const tr = document.createElement("tr");
      const fullName = (user && (user.name || user.first_name || user.last_name)) ? (user.name || "").toString() : "";
      tr.innerHTML = `
        <td>${escapeHtml(user.id)}</td>
        <td>${escapeHtml(fullName || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—")}</td>
        <td>${escapeHtml(user.email || "—")}</td>
        <td>${escapeHtml(user.phone || "—")}</td>
        <td>${escapeHtml(user.role || "—")}</td>
      `;

      if (isSuper) {
        tr.classList.add("variant-row-clickable");
        tr.title = "Нажмите, чтобы редактировать пользователя";
        tr.addEventListener("click", () => openUserEditorEdit(user));
      }

      usersTbody.appendChild(tr);
    }
  } catch (err) {
    if (err && err.status === 401) {
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      return;
    }
    const message = (err && err.message) ? err.message : "Ошибка загрузки пользователей";
    showAlert(usersError, message);
    setHidden(usersEmpty, true);
  }
}

function setUserEditorOpen(open) {
  if (!userEditorPanel) return;
  userEditorPanel.classList.toggle("hidden", !open);
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    const otherModalOpen =
      (createVariantPanel && !createVariantPanel.classList.contains("hidden")) ||
      (variantDetailPanel && !variantDetailPanel.classList.contains("hidden")) ||
      (settingsPanel && !settingsPanel.classList.contains("hidden"));
    document.body.style.overflow = otherModalOpen ? "hidden" : "";
  }
}

function setUserEditorError(message) {
  if (!userEditorError) return;
  userEditorError.textContent = message || "";
  setHidden(userEditorError, !message);
}

function resetUserEditorForm() {
  if (userEditorForm) userEditorForm.reset();
  if (userEditorPasswordInput) userEditorPasswordInput.value = "";
  setUserEditorError("");
  userEditorTargetId = null;
}

function openUserEditorCreate() {
  userEditorMode = "create";
  resetUserEditorForm();

  if (userEditorTitle) userEditorTitle.textContent = "Добавить пользователя";
  if (userEditorSubtitle) userEditorSubtitle.textContent = "Создание нового аккаунта (пароль обязателен)";

  // Defaults
  if (userEditorRoleSelect) userEditorRoleSelect.value = "REALTOR";
  if (userEditorPasswordInput) userEditorPasswordInput.placeholder = "Введите пароль";
  if (userEditorSubmitBtn) userEditorSubmitBtn.textContent = "Создать";

  // In create mode password is required (validated in submit handler).
  if (userEditorForm) userEditorForm.dataset.mode = "create";

  setUserEditorOpen(true);
}

function openUserEditorEdit(user) {
  userEditorMode = "edit";
  resetUserEditorForm();

  const u = user || {};
  userEditorTargetId = u.id;

  if (userEditorTitle) userEditorTitle.textContent = "Редактировать пользователя";
  if (userEditorSubtitle) userEditorSubtitle.textContent = "Данные и опциональная смена пароля";

  if (userEditorNameInput) userEditorNameInput.value = u.name || "";
  if (userEditorRoleSelect) userEditorRoleSelect.value = u.role || "REALTOR";
  if (userEditorEmailInput) userEditorEmailInput.value = u.email || "";
  if (userEditorPhoneInput) userEditorPhoneInput.value = u.phone || "";

  if (userEditorPasswordInput) {
    userEditorPasswordInput.value = "";
    userEditorPasswordInput.placeholder = "Новый пароль (пусто = не менять)";
  }
  if (userEditorSubmitBtn) userEditorSubmitBtn.textContent = "Сохранить изменения";
  if (userEditorForm) userEditorForm.dataset.mode = "edit";

  setUserEditorOpen(true);
}

function fileToBase64(file) {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const commaIdx = result.indexOf(",");
      if (commaIdx >= 0) resolve(result.slice(commaIdx + 1));
      else resolve(result);
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function buildUserEditorPhotoPayload() {
  if (!userEditorPhotoInput || !userEditorPhotoInput.files || !userEditorPhotoInput.files[0]) return null;
  const f = userEditorPhotoInput.files[0];
  const base64 = await fileToBase64(f);
  return { base64, filename: f.name || "photo", mime: f.type || "application/octet-stream" };
}

if (addUserBtn) {
  addUserBtn.addEventListener("click", () => {
    const role = dashboardUser && dashboardUser.role;
    if (role !== "SUPER_ADMIN") {
      toast("Нет доступа", "Только SUPER_ADMIN может добавлять пользователей.", "danger");
      return;
    }
    openUserEditorCreate();
  });
}

if (userEditorCloseBtn) userEditorCloseBtn.addEventListener("click", () => setUserEditorOpen(false));
if (userEditorCancelBtn) userEditorCancelBtn.addEventListener("click", () => setUserEditorOpen(false));
if (userEditorBackdrop) userEditorBackdrop.addEventListener("click", () => setUserEditorOpen(false));

if (userEditorForm) {
  userEditorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setUserEditorError("");

    const name = userEditorNameInput ? userEditorNameInput.value.trim() : "";
    const role = userEditorRoleSelect ? userEditorRoleSelect.value : "";
    const email = userEditorEmailInput ? userEditorEmailInput.value.trim() : "";
    const phone = userEditorPhoneInput ? userEditorPhoneInput.value.trim() : "";
    const password = userEditorPasswordInput ? userEditorPasswordInput.value : "";

    const isCreate = userEditorMode === "create";
    const errors = [];
    if (!name) errors.push("ФИО обязательно");
    if (!role) errors.push("Роль обязательна");
    if (!email) errors.push("Email обязателен");
    if (!phone) errors.push("Телефон обязателен");
    if (isCreate && (!password || password.trim() === "")) errors.push("Пароль обязателен");

    if (errors.length) {
      setUserEditorError(errors.join(". "));
      return;
    }

    try {
      if (!isCreate && !userEditorTargetId) throw new Error("ID пользователя не найден");

      const photoPayload = await buildUserEditorPhotoPayload();

      if (isCreate) {
        await window.desktopApi.createUser({
          email,
          name,
          phone,
          role,
          password,
          photo: photoPayload,
        });
        toast("Готово", "Пользователь создан.");
      } else {
        await window.desktopApi.updateUser(userEditorTargetId, {
          email,
          name,
          phone,
          role,
          password,
          photo: photoPayload,
        });
        toast("Готово", "Пользователь обновлён.");
      }

      setUserEditorOpen(false);
      resetUserEditorForm();
      await renderUsers();
    } catch (err) {
      const message = (err && err.message) ? err.message : "Ошибка сохранения пользователя";
      setUserEditorError(message);
      toast("Ошибка", message, "danger");

      if (err && err.status === 401) {
        await showLogin("Сессия устарела. Выполните вход снова.");
      }
    }
  });
}

let variantsMode = "all";
let variantTypesLoaded = false;
/** @type {Record<string, unknown> | null} */
let dashboardUser = null;

let variantDetailPhotos = [];
let variantDetailSlideIndex = 0;

let renderVariantsInFlight = false;
let superAdminMineFilterTaskId = 0;

// User editor state
let userEditorMode = "create"; // create | edit
let userEditorTargetId = null;

const VARIANT_DETAIL_LABELS = {
  id: "ID",
  type_id: "Тип",
  price: "Цена",
  rukprice: "Рук. цена",
  unit: "Ед. / примечание",
  mkv: "Площадь, м²",
  address: "Адрес",
  district_id: "ID района",
  subdistrict_id: "ID микрорайона",
  zhk_id: "ID ЖК",
  etaj: "Этаж",
  etajnost: "Этажность",
  rooms: "Комнаты",
  repair: "Ремонт",
  series: "Серия",
  status: "Статус",
  owner_name: "Владелец",
  owner_phone: "Тел. владельца",
  phone: "Телефон",
  curator_name: "Куратор",
  curator_id: "ID куратора",
  description: "Описание",
  notes: "Заметки",
  latitude: "Широта",
  longitude: "Долгота",
  date: "Дата",
  time: "Время",
};

const VARIANT_DETAIL_ORDER = [
  "id",
  "type_id",
  "price",
  "rukprice",
  "mkv",
  "unit",
  "address",
  "district_id",
  "subdistrict_id",
  "zhk_id",
  "etaj",
  "etajnost",
  "rooms",
  "repair",
  "series",
  "status",
  "owner_name",
  "owner_phone",
  "phone",
  "curator_name",
  "curator_id",
  "description",
  "notes",
  "latitude",
  "longitude",
  "date",
  "time",
];

function applyVariantsToolbarForRole() {
  const role = dashboardUser && dashboardUser.role;
  if (variantsModeAllBtn) {
    const isSuper = role === "SUPER_ADMIN";
    if (isSuper) {
      variantsModeAllBtn.classList.remove("hidden");
      if (variantsMode !== "all") setVariantsMode("all");
    } else {
      variantsModeAllBtn.classList.add("hidden");
      if (variantsMode !== "mine") setVariantsMode("mine");
    }
  }
}

function setVariantsMode(mode) {
  variantsMode = mode === "mine" ? "mine" : "all";
  if (variantsModeAllBtn) variantsModeAllBtn.classList.toggle("active", variantsMode === "all");
  if (variantsModeMineBtn) variantsModeMineBtn.classList.toggle("active", variantsMode === "mine");
}

async function loadVariantTypesSelect() {
  if (variantTypesLoaded) return;
  if (!variantTypeSelect) return;

  const types = await window.desktopApi.getPropertyTypes();
  const safe = Array.isArray(types) ? types : [];

  variantTypeSelect.innerHTML = `<option value="">Выберите тип</option>`;
  for (const t of safe) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    variantTypeSelect.appendChild(opt);
  }

  variantTypesLoaded = true;
}

function updatePricePerMkvHint() {
  if (!variantPricePerMkvHint) return;
  const price = variantPriceInput ? Number(variantPriceInput.value) : NaN;
  const mkv = variantMkvInput ? Number(variantMkvInput.value) : NaN;
  if (!Number.isFinite(price) || !Number.isFinite(mkv) || mkv <= 0) {
    variantPricePerMkvHint.textContent = "—";
    return;
  }
  variantPricePerMkvHint.textContent = `${(price / mkv).toFixed(2)} сом/м²`;
}

function setSelectOptions(select, items, placeholder, valueKey, labelKey, formatLabel) {
  if (!select) return;
  select.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder;
  select.appendChild(ph);
  for (const row of items) {
    const o = document.createElement("option");
    o.value = String(row[valueKey]);
    o.textContent = formatLabel ? formatLabel(row) : String(row[labelKey] ?? row[valueKey]);
    select.appendChild(o);
  }
}

function updateApartmentFieldsVisibility() {
  if (!variantApartmentFields || !variantTypeSelect) return;
  const t = (variantTypeSelect.value || "").toLowerCase();
  const show = t.includes("квартир");
  variantApartmentFields.classList.toggle("hidden", !show);
}

async function loadSubdistrictsForDistrict(districtId) {
  if (!variantSubdistrictSelect) return;
  const id = districtId ? String(districtId).trim() : "";
  if (!id) {
    variantSubdistrictSelect.innerHTML = `<option value="">Сначала выберите район</option>`;
    variantSubdistrictSelect.disabled = true;
    return;
  }
  variantSubdistrictSelect.disabled = false;
  variantSubdistrictSelect.innerHTML = `<option value="">Загрузка…</option>`;
  try {
    const rows = await window.desktopApi.getSubdistricts(id);
    const safe = Array.isArray(rows) ? rows : [];
    setSelectOptions(variantSubdistrictSelect, safe, "Выберите микрорайон", "id", "name");
  } catch (err) {
    variantSubdistrictSelect.innerHTML = `<option value="">Ошибка загрузки</option>`;
    if (err && err.status === 401) {
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
    }
    throw err;
  }
}

async function loadCreateVariantReference() {
  setHidden(createVariantError, true);
  await loadVariantTypesSelect();

  const auth = await window.desktopApi.getAuth();
  const role = auth && auth.user ? auth.user.role : "";
  const myId = auth && auth.user ? auth.user.id : null;
  const myName =
    auth && auth.user
      ? (auth.user.name || `${auth.user.first_name || ""} ${auth.user.last_name || ""}`.trim() || auth.user.email || String(myId))
      : "";

  let districts = [];
  let jkList = [];
  let curators = [];

  try {
    [districts, jkList, curators] = await Promise.all([
      window.desktopApi.getDistricts(),
      window.desktopApi.getJkList(),
      window.desktopApi.getCurators(),
    ]);
  } catch (err) {
    if (err && err.status === 401) {
      setCreatePanelOpen(false);
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      throw err;
    }
    const message = (err && err.message) ? err.message : "Не удалось загрузить справочники";
    if (createVariantError) {
      createVariantError.textContent = message;
      setHidden(createVariantError, false);
    }
    toast("Ошибка", message, "danger");
  }

  if (variantDistrictSelect) {
    setSelectOptions(variantDistrictSelect, Array.isArray(districts) ? districts : [], "Выберите район", "id", "name");
    variantDistrictSelect.disabled = false;
  }
  if (variantJkSelect) {
    const jk = Array.isArray(jkList) ? jkList : [];
    setSelectOptions(variantJkSelect, jk, "Выберите ЖК", "id", "name", (r) => {
      const n = r.name || `ЖК #${r.id}`;
      const a = r.address ? ` — ${r.address}` : "";
      return n + a;
    });
  }
  if (variantCuratorSelect) {
    variantCuratorSelect.innerHTML = "";
    if (role === "REALTOR" && myId != null) {
      const o = document.createElement("option");
      o.value = String(myId);
      o.textContent = myName ? `Куратор: ${myName}` : `Куратор (ID ${myId})`;
      variantCuratorSelect.appendChild(o);
      variantCuratorSelect.disabled = true;
    } else {
      variantCuratorSelect.disabled = false;
      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Выберите куратора";
      variantCuratorSelect.appendChild(ph);
      const list = Array.isArray(curators) ? curators : [];
      for (const c of list) {
        const o = document.createElement("option");
        o.value = String(c.id);
        o.textContent = c.name || `ID ${c.id}`;
        variantCuratorSelect.appendChild(o);
      }
    }
  }

  if (variantSubdistrictSelect) {
    variantSubdistrictSelect.innerHTML = `<option value="">Сначала выберите район</option>`;
    variantSubdistrictSelect.disabled = true;
  }

  updatePricePerMkvHint();
  updateApartmentFieldsVisibility();
}

async function renderVariants() {
  if (authInvalid) return;
  if (renderVariantsInFlight) return;
  renderVariantsInFlight = true;
  setHidden(variantsError, true);
  showAlert(variantsEmpty, "");
  variantsEmpty.classList.add("hidden");
  variantsTbody.innerHTML = "";

  const needClientFilterSuperAdminMine =
    !!(dashboardUser && dashboardUser.role === "SUPER_ADMIN" && variantsMode === "mine");
  const myId = needClientFilterSuperAdminMine ? Number(dashboardUser.id) : NaN;
  const localTaskId = ++superAdminMineFilterTaskId;
  /** @type {Map<number, HTMLTableRowElement>} */
  const rowElById = new Map();

  try {
    // Важно: для всех ролей кроме SUPER_ADMIN показываем только "Мои"
    // (чтобы ни при каких условиях не отображать чужие варианты).
    if (dashboardUser && dashboardUser.role !== "SUPER_ADMIN") {
      applyVariantsToolbarForRole();
    }

    const idValue = variantsIdFilterInput && variantsIdFilterInput.value ? variantsIdFilterInput.value.trim() : "";
    const idParam = idValue ? idValue : null;

    const variants = await window.desktopApi.getVariants(variantsMode, idParam);
    const safe = Array.isArray(variants) ? variants : [];

    setHidden(variantsError, true);
    setHidden(variantsEmpty, safe.length !== 0 ? true : false);

    if (safe.length === 0) return;

    // SUPER_ADMIN + режим "Мои": на бэке может прилететь всё.
    // Фильтруем до рендера, чтобы в таблице сразу был только "мой" список.
    if (needClientFilterSuperAdminMine && safe.length && Number.isFinite(myId)) {
      showLoading("Фильтрую ваши варианты...");
      try {
        const filtered = [];
        for (let i = 0; i < safe.length; i++) {
          if (authInvalid) return;
          const row = safe[i];
          const d = await window.desktopApi.getVariantDetail(row.id);
          const curatorId = d ? Number(d.curator_id) : NaN;
          if (Number.isFinite(curatorId) && curatorId === myId) {
            filtered.push(row);
          }
        }
        safe.splice(0, safe.length, ...filtered);
      } finally {
        hideLoading();
      }

      setHidden(variantsEmpty, safe.length !== 0 ? true : false);
      if (safe.length === 0) return;
    }

    for (const row of safe) {
      const tr = document.createElement("tr");
      tr.classList.add("variant-row-clickable");
      tr.title = "Нажмите, чтобы открыть карточку с фото";
      const priceText = row.price === null || row.price === undefined ? "—" : escapeHtml(row.price);
      const areaText = row.area === null || row.area === undefined ? "—" : escapeHtml(row.area);
      const districtText = row.district === null || row.district === undefined ? "—" : escapeHtml(row.district);
      const statusText = row.status === null || row.status === undefined ? "—" : escapeHtml(row.status);

      tr.innerHTML = `
        <td>${escapeHtml(row.id)}</td>
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.time)}</td>
        <td>${districtText}</td>
        <td>${areaText}</td>
        <td>${priceText}</td>
        <td>${statusText}</td>
      `;
      tr.addEventListener("click", () => {
        openVariantDetailPanel(row.id);
      });
      rowElById.set(Number(row.id), tr);
      variantsTbody.appendChild(tr);
    }
  } catch (err) {
    if (err && err.status === 401) {
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      return;
    }

    const message = (err && err.message) ? err.message : "Ошибка загрузки вариантов";
    showAlert(variantsError, message);
    setHidden(variantsEmpty, true);
  } finally {
    renderVariantsInFlight = false;
  }
}

function renderVariantDetailInfo(data) {
  if (!variantDetailInfo) return;
  variantDetailInfo.innerHTML = "";
  for (const key of VARIANT_DETAIL_ORDER) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const label = VARIANT_DETAIL_LABELS[key] || key;
    const val = data[key];
    if (val === null || val === undefined || val === "") continue;
    const wrap = document.createElement("div");
    wrap.className = "variant-detail-item";
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    const text =
      typeof val === "object" && val !== null ? JSON.stringify(val) : String(val);
    dd.textContent = text;
    if (text.includes("\n")) dd.style.whiteSpace = "pre-wrap";
    wrap.appendChild(dt);
    wrap.appendChild(dd);
    variantDetailInfo.appendChild(wrap);
  }
}

function renderVariantSlider() {
  const n = variantDetailPhotos.length;
  if (!variantDetailImg || !variantDetailNoPhotos) return;

  if (n === 0) {
    variantDetailImg.classList.add("hidden");
    variantDetailNoPhotos.classList.remove("hidden");
    if (variantDetailPrev) variantDetailPrev.disabled = true;
    if (variantDetailNext) variantDetailNext.disabled = true;
    if (variantDetailCounter) variantDetailCounter.textContent = "";
    if (variantDetailThumbs) variantDetailThumbs.innerHTML = "";
    return;
  }

  variantDetailImg.classList.remove("hidden");
  variantDetailNoPhotos.classList.add("hidden");
  variantDetailImg.src = variantDetailPhotos[variantDetailSlideIndex];
  if (variantDetailCounter) {
    variantDetailCounter.textContent = `${variantDetailSlideIndex + 1} / ${n}`;
  }
  if (variantDetailPrev) variantDetailPrev.disabled = variantDetailSlideIndex <= 0;
  if (variantDetailNext) variantDetailNext.disabled = variantDetailSlideIndex >= n - 1;

  if (variantDetailThumbs) {
    variantDetailThumbs.innerHTML = "";
    variantDetailPhotos.forEach((url, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `variant-thumb${i === variantDetailSlideIndex ? " active" : ""}`;
      const im = document.createElement("img");
      im.src = url;
      im.alt = "";
      b.appendChild(im);
      b.addEventListener("click", () => {
        variantDetailSlideIndex = i;
        renderVariantSlider();
      });
      variantDetailThumbs.appendChild(b);
    });
  }
}

function closeVariantDetailPanel() {
  if (!variantDetailPanel) return;
  variantDetailPanel.classList.add("hidden");
  variantDetailPhotos = [];
  const createOpen = createVariantPanel && !createVariantPanel.classList.contains("hidden");
  if (!createOpen) document.body.style.overflow = "";
  setHidden(variantDetailError, true);
  setHidden(variantDetailLoading, true);
  setHidden(variantDetailContent, true);
}

async function openVariantDetailPanel(id) {
  if (!variantDetailPanel) return;
  if (authInvalid) return;
  setHidden(variantDetailError, true);
  setHidden(variantDetailContent, true);
  setHidden(variantDetailLoading, false);
  variantDetailPanel.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  try {
    const data = await window.desktopApi.getVariantDetail(id);
    setHidden(variantDetailLoading, true);
    setHidden(variantDetailContent, false);

    variantDetailPhotos = Array.isArray(data.photos) ? data.photos.filter(Boolean) : [];
    variantDetailSlideIndex = 0;

    if (variantDetailTitle) variantDetailTitle.textContent = `Объект №${data.id}`;
    if (variantDetailSubtitle) {
      const parts = [data.type_id, data.address].filter(Boolean);
      variantDetailSubtitle.textContent = parts.length ? parts.map((p) => String(p)).join(" · ") : "Карточка объекта";
    }

    renderVariantSlider();
    renderVariantDetailInfo(data);

    if (data.document && variantDetailDocLink && variantDetailDocRow) {
      variantDetailDocLink.href = data.document;
      variantDetailDocRow.classList.remove("hidden");
    } else if (variantDetailDocRow) {
      variantDetailDocRow.classList.add("hidden");
    }
  } catch (err) {
    setHidden(variantDetailLoading, true);
    setHidden(variantDetailContent, true);
    if (err && err.status === 401) {
      closeVariantDetailPanel();
      toast("Сессия устарела", "Войдите снова.", "danger");
      await showLogin("Сессия устарела. Выполните вход снова.");
      return;
    }
    const msg = (err && err.message) ? err.message : "Ошибка загрузки карточки";
    if (variantDetailError) {
      variantDetailError.textContent = msg;
      setHidden(variantDetailError, false);
    }
    toast("Ошибка", msg, "danger");
  }
}

function setActiveNav(tab) {
  const map = {
    listings: navListingsBtn,
    raions: navRaionsBtn,
    users: navUsersBtn,
    types: navTypesBtn,
  };
  Object.keys(map).forEach((k) => {
    if (!map[k]) return;
    map[k].classList.toggle("active", k === tab);
  });
}

function setActiveView(tab) {
  // Toggle visibility.
  setHidden(viewListings, tab !== "listings");
  setHidden(viewRaions, tab !== "raions");
  setHidden(viewUsers, tab !== "users");
  setHidden(viewTypes, tab !== "types");

  // Stats only for listings.
  setHidden(statsWrap, tab !== "listings");

  activeTab = tab;
  lastTab = tab;

  if (pageTitleEl && pageSubtitleEl) {
    if (tab === "listings") {
      pageTitleEl.textContent = "Админ dashboard";
      pageSubtitleEl.textContent = "Список объектов недвижимости";
    } else if (tab === "raions") {
      pageTitleEl.textContent = "Админ panel";
      pageSubtitleEl.textContent = "Районы и микрорайоны";
    } else if (tab === "users") {
      pageTitleEl.textContent = "Админ panel";
      pageSubtitleEl.textContent = "Пользователи и роли";
    } else if (tab === "types") {
      pageTitleEl.textContent = "Админ panel";
      if (dashboardUser && dashboardUser.role === "REALTOR") {
        pageSubtitleEl.textContent = "Только ваши объекты";
      } else {
        pageSubtitleEl.textContent = "Мои и все варианты";
      }
      if (variantsPanelSubtitle) {
        variantsPanelSubtitle.textContent =
          dashboardUser && dashboardUser.role === "REALTOR"
            ? "Риелтор видит только объекты, где он указан куратором"
            : "Мои и все варианты с фильтром по ID";
      }
    }
  }

  setActiveNav(tab);

  if (autoOpenLastTab) {
    if (lastTabPersistTimer) clearTimeout(lastTabPersistTimer);
    lastTabPersistTimer = setTimeout(() => {
      if (window.desktopApi && window.desktopApi.setSettings) {
        window.desktopApi.setSettings(undefined, { lastTab: tab }).catch(() => {});
      }
    }, 400);
  }
}

async function showDashboard(auth) {
  setHidden(loginView, true);
  setHidden(dashboardView, false);

  const user = auth && auth.user ? auth.user : null;
  dashboardUser = user;
  authInvalid = false;
  userNameEl.textContent = user ? (user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Пользователь") : "Пользователь";
  userRoleEl.textContent = user ? (user.role || "—") : "—";
  userAvatarEl.textContent = computeUserAvatarInitials(user);

  // Default tab
  const allowedTabs = ["listings", "raions", "users", "types"];
  const initialTab = autoOpenLastTab && allowedTabs.includes(lastTab) ? lastTab : "listings";
  setActiveView(initialTab);
  await refreshForActiveTab();
  startAutoRefreshIfNeeded();
  if (dashboardUser) applyVariantsToolbarForRole();
}

async function showLogin(message) {
  dashboardUser = null;
  closeVariantDetailPanel();
  stopAutoRefresh();
  setUserEditorOpen(false);
  authInvalid = true;

  setHidden(dashboardView, true);
  setHidden(loginView, false);

  clearFieldErrors();
  updateLoginButtonState();

  if (message) showAlert(loginError, message);
  else showAlert(loginError, "");

  // Keep the baseUrl shown.
}

async function bootstrap() {
  showLoading("Запуск приложения...");
  await loadSettings();

  const auth = await window.desktopApi.getAuth();
  if (auth && auth.token) {
    try {
      showLoading("Проверяем сессию...");
      await showDashboard(auth);
      hideLoading();
      return;
    } catch (e) {
      // fallthrough to login
    }

    try {
      showLoading("Сбрасываем устаревшую сессию...");
      await window.desktopApi.clearAuth();
    } catch {}
    hideLoading();
    await showLogin("Сессия устарела. Выполните вход снова.");
  } else {
    hideLoading();
    await showLogin();
  }
}

showPasswordBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  showPasswordBtn.textContent = isPassword ? "Скрыть" : "Показать";
});

saveBaseUrlBtn.addEventListener("click", async () => {
  try {
    const value = baseUrlInput.value.trim();
    if (!value) throw new Error("Укажите Base URL");
    await window.desktopApi.setSettings(value);

    if (connectionStatusEl) {
      connectionStatusEl.classList.remove("bad");
      connectionStatusEl.classList.add("ok");
      connectionStatusEl.textContent = "Сохранено. При необходимости нажмите «Проверить».";
      setHidden(connectionStatusEl, false);
    }

    toast("Готово", "URL подключения сохранён.");
  } catch (err) {
    toast("Ошибка", (err && err.message) ? err.message : "Не удалось сохранить URL", "danger");
  }
});

// Auto-save Base URL as user types.
let baseUrlAutoSaveTimer = null;
let baseUrlLastAutoSaved = "";
const BASE_URL_AUTOSAVE_DEBOUNCE_MS = 800;

if (baseUrlInput) {
  baseUrlInput.addEventListener("input", () => {
    if (baseUrlSavedStatusEl) baseUrlSavedStatusEl.textContent = "";

    if (baseUrlAutoSaveTimer) clearTimeout(baseUrlAutoSaveTimer);
    baseUrlAutoSaveTimer = setTimeout(() => {
      const value = baseUrlInput.value.trim();
      if (!value) return;
      if (baseUrlInput && !baseUrlInput.checkValidity()) return;
      if (value === baseUrlLastAutoSaved) return;

      if (baseUrlSavedStatusEl) baseUrlSavedStatusEl.textContent = "Сохраняю...";

      window.desktopApi
        .setSettings(value)
        .then(() => {
          baseUrlLastAutoSaved = value;
          if (baseUrlSavedStatusEl) baseUrlSavedStatusEl.textContent = "Сохранено";
          setTimeout(() => {
            if (baseUrlSavedStatusEl) baseUrlSavedStatusEl.textContent = "";
          }, 1200);
        })
        .catch(() => {
          if (baseUrlSavedStatusEl) baseUrlSavedStatusEl.textContent = "Ошибка сохранения";
        });
    }, BASE_URL_AUTOSAVE_DEBOUNCE_MS);
  });
}

testBaseUrlBtn.addEventListener("click", async () => {
  const value = baseUrlInput.value.trim();
  if (!value) {
    if (connectionStatusEl) {
      connectionStatusEl.classList.remove("ok");
      connectionStatusEl.classList.add("bad");
      connectionStatusEl.textContent = "Введите Base URL.";
      setHidden(connectionStatusEl, false);
    }
    return;
  }

  const prevTestText = testBaseUrlBtn.textContent;
  const prevSaveDisabled = saveBaseUrlBtn.disabled;
  const prevSaveText = saveBaseUrlBtn.textContent;

  testBaseUrlBtn.disabled = true;
  saveBaseUrlBtn.disabled = true;
  testBaseUrlBtn.textContent = "Проверяю...";
  saveBaseUrlBtn.textContent = "Ожидайте...";

  try {
    if (connectionStatusEl) {
      connectionStatusEl.classList.remove("ok");
      connectionStatusEl.classList.remove("bad");
      connectionStatusEl.textContent = "Проверка соединения...";
      setHidden(connectionStatusEl, false);
    }

    const result = await window.desktopApi.pingApi(value);
    const msg = (result && result.data && result.data.message) ? result.data.message : "Ок";

    if (connectionStatusEl) {
      connectionStatusEl.classList.remove("bad");
      connectionStatusEl.classList.add("ok");
      connectionStatusEl.textContent = msg;
      setHidden(connectionStatusEl, false);
    }
  } catch (err) {
    const message = (err && err.message) ? err.message : "Не удалось проверить";
    if (connectionStatusEl) {
      connectionStatusEl.classList.remove("ok");
      connectionStatusEl.classList.add("bad");
      connectionStatusEl.textContent = message;
      setHidden(connectionStatusEl, false);
    }
    toast("Ошибка", message, "danger");
  } finally {
    testBaseUrlBtn.disabled = false;
    saveBaseUrlBtn.disabled = prevSaveDisabled;
    testBaseUrlBtn.textContent = prevTestText;
    saveBaseUrlBtn.textContent = prevSaveText;
  }
});

emailInput.addEventListener("input", () => {
  clearFieldErrors();
  showAlert(loginError, "");
  updateLoginButtonState();
});

passwordInput.addEventListener("input", () => {
  clearFieldErrors();
  showAlert(loginError, "");
  updateLoginButtonState();
});

function persistRememberEmail() {
  if (!rememberEmailCheckbox) return;
  const checked = !!rememberEmailCheckbox.checked;
  const v = checked ? emailInput.value.trim() : "";
  window.desktopApi.setSettings(undefined, { rememberEmail: checked, lastEmail: v }).catch(() => {});
}

if (rememberEmailCheckbox) {
  rememberEmailCheckbox.addEventListener("change", persistRememberEmail);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearFieldErrors();
  showAlert(loginError, "");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const formReady = isEmailValid() && isPasswordValid();
  if (!formReady) {
    if (!isEmailValid()) setFieldError(emailInput, emailErrorEl, "Введите корректный email.");
    if (!isPasswordValid()) setFieldError(passwordInput, passwordErrorEl, "Пароль не должен быть пустым.");
    shakeElement(loginForm);
    updateLoginButtonState();
    return;
  }

  setButtonLoading(loginBtn, loginSpinner, true);

  try {
    await window.desktopApi.login(email, password);
    toast("Успешно", "Вход выполнен.");

    // Save rememberEmail preference after successful login.
    if (typeof persistRememberEmail === "function") persistRememberEmail();

    // Load user/token from main state
    const auth = await window.desktopApi.getAuth();
    await showDashboard(auth);
  } catch (err) {
    const message = (err && err.message) ? err.message : "Ошибка входа";
    showAlert(loginError, message);

    const lower = String(message).toLowerCase();
    const hasEmail = lower.includes("email");
    const hasPass = lower.includes("парол");
    const hasRequired = lower.includes("обязатель");

    if (hasEmail) setFieldError(emailInput, emailErrorEl, hasRequired ? "Email и пароль обязательны." : "Email неверный.");
    if (hasPass) setFieldError(passwordInput, passwordErrorEl, hasRequired ? "Email и пароль обязательны." : "Пароль неверный.");

    shakeElement(loginForm);
    toast("Ошибка входа", message, "danger");
  } finally {
    setButtonLoading(loginBtn, loginSpinner, false);
  }
});

logoutBtn.addEventListener("click", async () => {
  showLoading("Выходим из аккаунта...");
  setHidden(listingsError, true);
  try {
    await window.desktopApi.logout();
  } catch {
    // Ignore; local state will be cleared anyway.
  }
  try {
    await window.desktopApi.clearAuth();
  } catch {}
  dashboardUser = null;
  await showLogin();
  emailInput.focus();
  hideLoading();
});

refreshBtn.addEventListener("click", async () => {
  try {
    if (activeTab === "listings") await renderListings();
    if (activeTab === "raions") await renderRaions();
    if (activeTab === "users") await renderUsers();
    if (activeTab === "types") {
      applyVariantsToolbarForRole();
      await renderVariants();
    }
  } catch {}
});

function setSettingsOpen(open) {
  if (!settingsPanel) return;
  settingsPanel.classList.toggle("hidden", !open);
  if (open) document.body.style.overflow = "hidden";
  else {
    const otherModalOpen =
      (createVariantPanel && !createVariantPanel.classList.contains("hidden")) ||
      (variantDetailPanel && !variantDetailPanel.classList.contains("hidden")) ||
      (userEditorPanel && !userEditorPanel.classList.contains("hidden"));
    document.body.style.overflow = otherModalOpen ? "hidden" : "";
  }
}

if (openSettingsBtn) {
  openSettingsBtn.addEventListener("click", () => setSettingsOpen(true));
}
if (settingsBackdrop) {
  settingsBackdrop.addEventListener("click", () => setSettingsOpen(false));
}
if (settingsCloseBtn) {
  settingsCloseBtn.addEventListener("click", () => setSettingsOpen(false));
}

function setThemeModeAndPersist(nextMode) {
  applyThemeMode(nextMode);
  if (!window.desktopApi || !window.desktopApi.setSettings) return;
  window.desktopApi.setSettings(undefined, { themeMode: nextMode }).catch(() => {
    toast("Ошибка", "Не удалось сохранить тему.", "danger");
  });
}

if (themeModeSystemBtn) themeModeSystemBtn.addEventListener("click", () => setThemeModeAndPersist("system"));
if (themeModeDarkBtn) themeModeDarkBtn.addEventListener("click", () => setThemeModeAndPersist("dark"));
if (themeModeLightBtn) themeModeLightBtn.addEventListener("click", () => setThemeModeAndPersist("light"));

function persistAutoRefresh(enabled, intervalSec) {
  if (!window.desktopApi || !window.desktopApi.setSettings) return;
  window.desktopApi.setSettings(undefined, {
    autoRefreshEnabled: enabled,
    autoRefreshIntervalSec: intervalSec,
  }).catch(() => {
    toast("Ошибка", "Не удалось сохранить автообновление.", "danger");
  });
}

function onAutoRefreshChanged() {
  autoRefreshEnabled = !!(autoRefreshEnabledInput && autoRefreshEnabledInput.checked);
  autoRefreshIntervalSec = Number(autoRefreshIntervalSecSelect ? autoRefreshIntervalSecSelect.value : 60);
  persistAutoRefresh(autoRefreshEnabled, autoRefreshIntervalSec);

  startAutoRefreshIfNeeded();
}

if (autoRefreshEnabledInput) autoRefreshEnabledInput.addEventListener("change", onAutoRefreshChanged);
if (autoRefreshIntervalSecSelect) autoRefreshIntervalSecSelect.addEventListener("change", onAutoRefreshChanged);

function persistUiSetting(patch) {
  if (!window.desktopApi || !window.desktopApi.setSettings) return;
  window.desktopApi.setSettings(undefined, patch).catch(() => {});
}

if (animationsEnabledInput) {
  animationsEnabledInput.addEventListener("change", () => {
    animationsEnabled = !!animationsEnabledInput.checked;
    document.body.classList.toggle("no-animations", !animationsEnabled);
    persistUiSetting({ animationsEnabled });
  });
}

if (loadingOverlayEnabledInput) {
  loadingOverlayEnabledInput.addEventListener("change", () => {
    loadingOverlayEnabled = !!loadingOverlayEnabledInput.checked;
    if (!loadingOverlayEnabled) hideLoading();
    persistUiSetting({ loadingOverlayEnabled });
  });
}

if (autoOpenLastTabInput) {
  autoOpenLastTabInput.addEventListener("change", () => {
    autoOpenLastTab = !!autoOpenLastTabInput.checked;
    persistUiSetting({ autoOpenLastTab });
  });
}

if (settingsLogoutBtn) {
  settingsLogoutBtn.addEventListener("click", async () => {
    setSettingsOpen(false);
    showLoading("Выходим из аккаунта...");
    try {
      await window.desktopApi.logout();
    } catch {}
    try {
      await window.desktopApi.clearAuth();
    } catch {}
    dashboardUser = null;
    await showLogin();
    emailInput.focus();
    hideLoading();
  });
}

if (clearSavedEmailBtn) {
  clearSavedEmailBtn.addEventListener("click", async () => {
    setSettingsOpen(false);
    persistUiSetting({ rememberEmail: false, lastEmail: "" });
    if (rememberEmailCheckbox) rememberEmailCheckbox.checked = false;
    if (emailInput) emailInput.value = "";
    toast("Готово", "Email очищен.", "default");
  });
}

navListingsBtn.addEventListener("click", async () => {
  setActiveView("listings");
  await renderListings();
});

navRaionsBtn.addEventListener("click", async () => {
  setActiveView("raions");
  await renderRaions();
});

navUsersBtn.addEventListener("click", async () => {
  setActiveView("users");
  await renderUsers();
});

navTypesBtn.addEventListener("click", async () => {
  setActiveView("types");
  applyVariantsToolbarForRole();
  await renderVariants();
});

// Variants controls (filter + create)
function setCreatePanelOpen(open) {
  if (!createVariantPanel) return;
  createVariantPanel.classList.toggle("hidden", !open);
  if (open) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (variantTypeSelect) variantTypeSelect.focus();
    }, 0);
  } else {
    document.body.style.overflow = "";
  }
}

function setVariantsUiLoading(button, loading) {
  if (!button) return;
  button.disabled = !!loading;
}

if (variantsModeAllBtn) {
  variantsModeAllBtn.addEventListener("click", async () => {
    setVariantsMode("all");
    await renderVariants();
  });
}
if (variantsModeMineBtn) {
  variantsModeMineBtn.addEventListener("click", async () => {
    setVariantsMode("mine");
    await renderVariants();
  });
}

if (applyVariantsFilterBtn) {
  applyVariantsFilterBtn.addEventListener("click", async () => {
    await renderVariants();
  });
}

if (resetVariantsFilterBtn) {
  resetVariantsFilterBtn.addEventListener("click", async () => {
    if (variantsIdFilterInput) variantsIdFilterInput.value = "";
    const role = dashboardUser && dashboardUser.role;
    if (role === "SUPER_ADMIN") setVariantsMode("all");
    else setVariantsMode("mine");
    await renderVariants();
  });
}

if (toggleCreateVariantBtn) {
  toggleCreateVariantBtn.addEventListener("click", async () => {
    if (!createVariantPanel) return;
    const isOpen = !createVariantPanel.classList.contains("hidden");
    setCreatePanelOpen(!isOpen);
    setHidden(createVariantError, true);
    if (!isOpen) {
      try {
        await loadCreateVariantReference();
      } catch {
        // 401 и др. уже обработаны
      }
    }
  });
}

if (variantDistrictSelect) {
  variantDistrictSelect.addEventListener("change", async () => {
    const v = variantDistrictSelect.value;
    try {
      await loadSubdistrictsForDistrict(v);
    } catch {
      // сообщения уже показаны
    }
  });
}

if (variantTypeSelect) {
  variantTypeSelect.addEventListener("change", () => updateApartmentFieldsVisibility());
}

if (variantPriceInput) variantPriceInput.addEventListener("input", updatePricePerMkvHint);
if (variantMkvInput) variantMkvInput.addEventListener("input", updatePricePerMkvHint);

if (cancelCreateVariantBtn) {
  cancelCreateVariantBtn.addEventListener("click", () => {
    setCreatePanelOpen(false);
    if (createVariantForm) createVariantForm.reset();
    setHidden(createVariantError, true);
  });
}

if (cancelCreateVariantBtn2) {
  cancelCreateVariantBtn2.addEventListener("click", () => {
    setCreatePanelOpen(false);
    if (createVariantForm) createVariantForm.reset();
    setHidden(createVariantError, true);
  });
}

if (createVariantBackdrop) {
  createVariantBackdrop.addEventListener("click", () => {
    setCreatePanelOpen(false);
    if (createVariantForm) createVariantForm.reset();
    setHidden(createVariantError, true);
  });
}

if (variantDetailBackdrop) {
  variantDetailBackdrop.addEventListener("click", () => closeVariantDetailPanel());
}
if (variantDetailCloseBtn) {
  variantDetailCloseBtn.addEventListener("click", () => closeVariantDetailPanel());
}
if (variantDetailPrev) {
  variantDetailPrev.addEventListener("click", () => {
    if (variantDetailSlideIndex > 0) {
      variantDetailSlideIndex -= 1;
      renderVariantSlider();
    }
  });
}
if (variantDetailNext) {
  variantDetailNext.addEventListener("click", () => {
    if (variantDetailSlideIndex < variantDetailPhotos.length - 1) {
      variantDetailSlideIndex += 1;
      renderVariantSlider();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (variantDetailPanel && !variantDetailPanel.classList.contains("hidden")) {
      closeVariantDetailPanel();
      return;
    }
    if (createVariantPanel && !createVariantPanel.classList.contains("hidden")) {
      setCreatePanelOpen(false);
      if (createVariantForm) createVariantForm.reset();
      setHidden(createVariantError, true);
    }
    if (userEditorPanel && !userEditorPanel.classList.contains("hidden")) {
      setUserEditorOpen(false);
    }
    return;
  }

  if (variantDetailPanel && !variantDetailPanel.classList.contains("hidden") && variantDetailPhotos.length > 1) {
    if (e.key === "ArrowLeft") {
      variantDetailSlideIndex = Math.max(0, variantDetailSlideIndex - 1);
      renderVariantSlider();
    } else if (e.key === "ArrowRight") {
      variantDetailSlideIndex = Math.min(variantDetailPhotos.length - 1, variantDetailSlideIndex + 1);
      renderVariantSlider();
    }
  }
});

const createVariantBtn = $("createVariantBtn");

if (createVariantForm) {
  createVariantForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    setHidden(createVariantError, true);
    const type_id = variantTypeSelect ? variantTypeSelect.value : "";
    const price = variantPriceInput ? Number(variantPriceInput.value) : NaN;
    const rukprice = variantRukPriceInput ? Number(variantRukPriceInput.value) : NaN;
    const mkv = variantMkvInput ? Number(variantMkvInput.value) : NaN;
    const address = variantAddressInput ? variantAddressInput.value.trim() : "";
    const etaj = variantEtajInput ? Number(variantEtajInput.value) : NaN;
    const etajnost = variantEtajnostInput ? Number(variantEtajnostInput.value) : NaN;

    const district_id = variantDistrictSelect ? variantDistrictSelect.value.trim() : "";
    const subdistrict_id = variantSubdistrictSelect ? variantSubdistrictSelect.value.trim() : "";
    const zhk_id = variantJkSelect ? variantJkSelect.value.trim() : "";
    const curator_id = variantCuratorSelect ? variantCuratorSelect.value.trim() : "";

    const errors = [];
    if (!type_id) errors.push("Выберите тип");
    if (!Number.isFinite(price) || price <= 0) errors.push("Цена должна быть > 0");
    if (!Number.isFinite(rukprice) || rukprice <= 0) errors.push("Рук. цена должна быть > 0");
    if (!Number.isFinite(mkv) || mkv <= 0) errors.push("Площадь должна быть > 0");
    if (!address) errors.push("Адрес обязателен");
    if (!Number.isFinite(etaj) || etaj <= 0) errors.push("Этаж должен быть > 0");
    if (!Number.isFinite(etajnost) || etajnost <= 0) errors.push("Этажность должна быть > 0");
    if (subdistrict_id && !district_id) errors.push("Выберите район для микрорайона");

    if (errors.length > 0) {
      createVariantError.textContent = errors.join(". ");
      setHidden(createVariantError, false);
      shakeElement(createVariantForm);
      return;
    }

    const payload = {
      type_id,
      price,
      rukprice,
      mkv,
      address,
      etaj,
      etajnost,
    };

    if (district_id) payload.district_id = Number(district_id);
    if (subdistrict_id) payload.subdistrict_id = Number(subdistrict_id);
    if (zhk_id) payload.zhk_id = Number(zhk_id);
    if (curator_id) payload.curator_id = Number(curator_id);

    const owner_name = variantOwnerNameInput ? variantOwnerNameInput.value.trim() : "";
    const owner_phone = variantOwnerPhoneInput ? variantOwnerPhoneInput.value.trim() : "";
    const phone = variantPhoneInput ? variantPhoneInput.value.trim() : "";
    const status = variantStatusInput ? variantStatusInput.value.trim() : "";
    const description = variantDescriptionInput ? variantDescriptionInput.value.trim() : "";
    const notes = variantNotesInput ? variantNotesInput.value.trim() : "";
    if (owner_name) payload.owner_name = owner_name;
    if (owner_phone) payload.owner_phone = owner_phone;
    if (phone) payload.phone = phone;
    if (status) payload.status = status;
    if (description) payload.description = description;
    if (notes) payload.notes = notes;

    const repair = variantRepairInput ? variantRepairInput.value.trim() : "";
    const series = variantSeriesInput ? variantSeriesInput.value.trim() : "";
    const rooms = variantRoomsInput ? variantRoomsInput.value.trim() : "";
    if (repair) payload.repair = repair;
    if (series) payload.series = series;
    if (rooms) payload.rooms = rooms;

    setVariantsUiLoading(createVariantBtn, true);
    try {
      const files = variantPhotosInput && variantPhotosInput.files ? Array.from(variantPhotosInput.files) : [];
      const docFile = variantDocumentInput && variantDocumentInput.files ? variantDocumentInput.files[0] : null;

      if (files.length === 0 && !docFile) {
        await window.desktopApi.createVariant(payload);
      } else {
        // Convert files to base64 for multipart upload via Electron main process.
        const photos = [];
        for (const f of files) {
          const base64 = await fileToBase64(f);
          if (!base64) continue;
          photos.push({ base64, filename: f.name || "photo", mime: f.type || "application/octet-stream" });
        }

        let document = null;
        if (docFile) {
          const base64 = await fileToBase64(docFile);
          if (base64) {
            document = { base64, filename: docFile.name || "document", mime: docFile.type || "application/octet-stream" };
          }
        }

        await window.desktopApi.createPropertyWithFiles(payload, photos, document);
      }

      toast("Готово", "Объект добавлен.");
      setCreatePanelOpen(false);
      createVariantForm.reset();
      if (variantPhotosInput) variantPhotosInput.value = "";
      if (variantDocumentInput) variantDocumentInput.value = "";
      await renderVariants();
    } catch (err) {
      if (err && err.status === 401) {
        toast("Сессия устарела", "Войдите снова.", "danger");
        await showLogin("Сессия устарела. Выполните вход снова.");
        return;
      }
      const message = (err && err.message) ? err.message : "Ошибка создания варианта";
      createVariantError.textContent = message;
      setHidden(createVariantError, false);
      toast("Ошибка", message, "danger");
    } finally {
      setVariantsUiLoading(createVariantBtn, false);
    }
  });
}

// Start
bootstrap().catch((err) => {
  // If something fails early, show login.
  showLogin((err && err.message) ? err.message : "Ошибка запуска");
  hideLoading();
});

