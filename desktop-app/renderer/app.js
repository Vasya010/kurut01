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

const logoutBtn = $("logoutBtn");
const refreshBtn = $("refreshBtn");

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
const createVariantError = $("createVariantError");

const variantTypeSelect = $("variantType");
const variantPriceInput = $("variantPrice");
const variantRukPriceInput = $("variantRukPrice");
const variantMkvInput = $("variantMkv");
const variantAddressInput = $("variantAddress");
const variantEtajInput = $("variantEtaj");
const variantEtajnostInput = $("variantEtajnost");

const toastHost = $("toastHost");

const navListingsBtn = $("navListings");
const navRaionsBtn = $("navRaions");
const navUsersBtn = $("navUsers");
const navTypesBtn = $("navTypes");

const viewListings = $("viewListings");
const viewRaions = $("viewRaions");
const viewUsers = $("viewUsers");
const viewTypes = $("viewTypes");

let activeTab = "listings";

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
  const { baseUrl } = await window.desktopApi.getSettings();
  baseUrlInput.value = baseUrl;
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

let variantsMode = "all";
let variantTypesLoaded = false;

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

async function renderVariants() {
  setHidden(variantsError, true);
  showAlert(variantsEmpty, "");
  variantsEmpty.classList.add("hidden");
  variantsTbody.innerHTML = "";

  try {
    const idValue = variantsIdFilterInput && variantsIdFilterInput.value ? variantsIdFilterInput.value.trim() : "";
    const idParam = idValue ? idValue : null;

    const variants = await window.desktopApi.getVariants(variantsMode, idParam);
    const safe = Array.isArray(variants) ? variants : [];

    setHidden(variantsError, true);
    setHidden(variantsEmpty, safe.length !== 0 ? true : false);

    if (safe.length === 0) return;

    for (const row of safe) {
      const tr = document.createElement("tr");
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
      pageSubtitleEl.textContent = "Мои и все варианты";
    }
  }

  setActiveNav(tab);
}

async function showDashboard(auth) {
  setHidden(loginView, true);
  setHidden(dashboardView, false);

  const user = auth && auth.user ? auth.user : null;
  userNameEl.textContent = user ? (user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Пользователь") : "Пользователь";
  userRoleEl.textContent = user ? (user.role || "—") : "—";
  userAvatarEl.textContent = computeUserAvatarInitials(user);

  // Default tab
  setActiveView("listings");
  await renderListings();
}

async function showLogin(message) {
  setHidden(dashboardView, true);
  setHidden(loginView, false);

  clearFieldErrors();
  updateLoginButtonState();

  if (message) showAlert(loginError, message);
  else showAlert(loginError, "");

  // Keep the baseUrl shown.
}

async function bootstrap() {
  await loadSettings();

  const auth = await window.desktopApi.getAuth();
  if (auth && auth.token) {
    try {
      await showDashboard(auth);
      return;
    } catch (e) {
      // fallthrough to login
    }

    try {
      await window.desktopApi.clearAuth();
    } catch {}
    await showLogin("Сессия устарела. Выполните вход снова.");
  } else {
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
  setHidden(listingsError, true);
  try {
    await window.desktopApi.logout();
  } catch {
    // Ignore; local state will be cleared anyway.
  }
  try {
    await window.desktopApi.clearAuth();
  } catch {}
  await showLogin();
  emailInput.focus();
});

refreshBtn.addEventListener("click", async () => {
  try {
    if (activeTab === "listings") await renderListings();
    if (activeTab === "raions") await renderRaions();
    if (activeTab === "users") await renderUsers();
    if (activeTab === "types") await renderVariants();
  } catch {}
});

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
  await renderVariants();
});

// Variants controls (filter + create)
function setCreatePanelOpen(open) {
  if (!createVariantPanel) return;
  createVariantPanel.classList.toggle("hidden", !open);
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
    setVariantsMode("all");
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
      await loadVariantTypesSelect();
    }
  });
}

if (cancelCreateVariantBtn) {
  cancelCreateVariantBtn.addEventListener("click", () => {
    setCreatePanelOpen(false);
    if (createVariantForm) createVariantForm.reset();
    setHidden(createVariantError, true);
  });
}

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

    const errors = [];
    if (!type_id) errors.push("Выберите тип");
    if (!Number.isFinite(price) || price <= 0) errors.push("Цена должна быть > 0");
    if (!Number.isFinite(rukprice) || rukprice <= 0) errors.push("Рук. цена должна быть > 0");
    if (!Number.isFinite(mkv) || mkv <= 0) errors.push("Площадь должна быть > 0");
    if (!address) errors.push("Адрес обязателен");
    if (!Number.isFinite(etaj) || etaj <= 0) errors.push("Этаж должен быть > 0");
    if (!Number.isFinite(etajnost) || etajnost <= 0) errors.push("Этажность должна быть > 0");

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

    setVariantsUiLoading(createVariantBtn, true);
    try {
      await window.desktopApi.createVariant(payload);
      toast("Готово", "Вариант создан.");
      setCreatePanelOpen(false);
      createVariantForm.reset();
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
});

