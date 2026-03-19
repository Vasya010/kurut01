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
  if (!loadingOverlay) return;
  loadingOverlay.classList.remove("hidden");
  if (loadingSubtitle) {
    loadingSubtitle.textContent = message || "Загрузка...";
  }
}

function hideLoading() {
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
/** @type {Record<string, unknown> | null} */
let dashboardUser = null;

let variantDetailPhotos = [];
let variantDetailSlideIndex = 0;

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
    if (role === "REALTOR") {
      variantsModeAllBtn.classList.add("hidden");
      if (variantsMode !== "mine") setVariantsMode("mine");
    } else {
      variantsModeAllBtn.classList.remove("hidden");
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
}

async function showDashboard(auth) {
  setHidden(loginView, true);
  setHidden(dashboardView, false);

  const user = auth && auth.user ? auth.user : null;
  dashboardUser = user;
  userNameEl.textContent = user ? (user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Пользователь") : "Пользователь";
  userRoleEl.textContent = user ? (user.role || "—") : "—";
  userAvatarEl.textContent = computeUserAvatarInitials(user);

  // Default tab
  setActiveView("listings");
  await renderListings();
}

async function showLogin(message) {
  dashboardUser = null;
  closeVariantDetailPanel();

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
    if (role === "REALTOR") setVariantsMode("mine");
    else setVariantsMode("all");
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
      await window.desktopApi.createVariant(payload);
      toast("Готово", "Объект добавлен.");
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
  hideLoading();
});

