const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const os = require("os");

/** Windows 11+ (build ≥ 22000): Mica; Win10: Acrylic; иначе без эффекта */
function winBackgroundMaterial() {
  if (process.platform !== "win32") return undefined;
  const parts = String(os.release() || "").split(".");
  const build = parseInt(parts[2] || "0", 10);
  if (build >= 22000) return "mica";
  if (build >= 10240) return "acrylic";
  return undefined;
}

const DEFAULT_BASE_URL = "https://vasya010-kurut01-710e.twc1.net";

let store = null;

async function ensureStore() {
  if (store) return store;
  // electron-store v9+ is ESM-only, so we must import it dynamically from CommonJS.
  const mod = await import("electron-store");
  const Store = mod.default || mod;
  store = new Store();
  return store;
}

async function getBaseUrl() {
  const s = await ensureStore();
  return (s.get("baseUrl") || DEFAULT_BASE_URL).toString().trim();
}

async function getToken() {
  const s = await ensureStore();
  return s.get("token") || null;
}

async function apiFetch(endpoint, { method = "GET", token = null, body = undefined, baseUrlOverride = null } = {}) {
  const baseUrl = (baseUrlOverride ? baseUrlOverride : await getBaseUrl()).replace(/\/$/, "");
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const init = {
    method,
    headers,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const text = await res.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ? (data.error || data.message) :
      (typeof data === "string" && data) ? data :
      `HTTP ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

ipcMain.handle("get-settings", async () => {
  await ensureStore();
  return {
    baseUrl: await getBaseUrl(),
    themeMode: (store.get("themeMode") || "system").toString(),
    autoRefreshEnabled: !!store.get("autoRefreshEnabled"),
    autoRefreshIntervalSec: Number(store.get("autoRefreshIntervalSec") ?? 60),
    rememberEmail: !!store.get("rememberEmail"),
    lastEmail: (store.get("lastEmail") || "").toString(),
    animationsEnabled: store.get("animationsEnabled") !== false,
    loadingOverlayEnabled: store.get("loadingOverlayEnabled") !== false,
    autoOpenLastTab: store.get("autoOpenLastTab") !== false,
    lastTab: (store.get("lastTab") || "listings").toString(),
    uiScale: (store.get("uiScale") || "comfortable").toString(),
    sidebarCompact: !!store.get("sidebarCompact"),
    glassStyle: (store.get("glassStyle") || "balanced").toString(),
    uiDensity: (store.get("uiDensity") || "comfortable").toString(),
    toastEnabled: store.get("toastEnabled") !== false,
    toastDurationSec: Number(store.get("toastDurationSec") ?? 3),
    defaultStartTab: (store.get("defaultStartTab") || "listings").toString(),
  };
});

ipcMain.handle("set-settings", async (_event, { baseUrl, themeMode, autoRefreshEnabled, autoRefreshIntervalSec, rememberEmail, lastEmail, animationsEnabled, loadingOverlayEnabled, autoOpenLastTab, lastTab, uiScale, sidebarCompact, glassStyle, uiDensity, toastEnabled, toastDurationSec, defaultStartTab } = {}) => {
  const s = await ensureStore();

  let cleanedBaseUrl = await getBaseUrl();
  if (baseUrl !== undefined) {
    if (!baseUrl || typeof baseUrl !== "string") throw new Error("baseUrl must be a string");
    cleanedBaseUrl = baseUrl.toString().trim().replace(/\/$/, "");
    s.set("baseUrl", cleanedBaseUrl);
  }

  if (themeMode !== undefined) {
    const allowed = ["system", "dark", "light"];
    const next = themeMode.toString().trim().toLowerCase();
    if (!allowed.includes(next)) throw new Error("themeMode must be 'system', 'dark' or 'light'");
    s.set("themeMode", next);
  }

  if (typeof autoRefreshEnabled === "boolean") {
    s.set("autoRefreshEnabled", autoRefreshEnabled);
  }

  if (autoRefreshIntervalSec !== undefined) {
    const n = Number(autoRefreshIntervalSec);
    if (!Number.isFinite(n) || n < 10 || n > 600) throw new Error("autoRefreshIntervalSec must be 10..600");
    s.set("autoRefreshIntervalSec", n);
  }

  if (rememberEmail !== undefined) {
    s.set("rememberEmail", !!rememberEmail);
  }

  if (lastEmail !== undefined) {
    const v = String(lastEmail ?? "").trim();
    // Store only if non-empty; otherwise just clear.
    s.set("lastEmail", v);
  }

  if (typeof animationsEnabled === "boolean") {
    s.set("animationsEnabled", animationsEnabled);
  }

  if (typeof loadingOverlayEnabled === "boolean") {
    s.set("loadingOverlayEnabled", loadingOverlayEnabled);
  }

  if (typeof autoOpenLastTab === "boolean") {
    s.set("autoOpenLastTab", autoOpenLastTab);
  }

  if (lastTab !== undefined && lastTab !== null) {
    const v = String(lastTab).trim();
    // allowed tabs
    const allowed = ["listings", "raions", "users", "types", "branches"];
    s.set("lastTab", allowed.includes(v) ? v : "listings");
  }

  if (uiScale !== undefined) {
    const allowed = ["compact", "comfortable", "large"];
    const next = uiScale.toString().trim().toLowerCase();
    if (!allowed.includes(next)) throw new Error("uiScale must be 'compact', 'comfortable' or 'large'");
    s.set("uiScale", next);
  }

  if (typeof sidebarCompact === "boolean") {
    s.set("sidebarCompact", sidebarCompact);
  }

  if (glassStyle !== undefined) {
    const allowed = ["subtle", "balanced", "rich"];
    const next = glassStyle.toString().trim().toLowerCase();
    if (!allowed.includes(next)) throw new Error("glassStyle must be 'subtle', 'balanced' or 'rich'");
    s.set("glassStyle", next);
  }

  if (uiDensity !== undefined) {
    const allowed = ["comfortable", "compact"];
    const next = uiDensity.toString().trim().toLowerCase();
    if (!allowed.includes(next)) throw new Error("uiDensity must be 'comfortable' or 'compact'");
    s.set("uiDensity", next);
  }

  if (typeof toastEnabled === "boolean") {
    s.set("toastEnabled", toastEnabled);
  }

  if (toastDurationSec !== undefined) {
    const n = Number(toastDurationSec);
    if (!Number.isFinite(n) || n < 2 || n > 12) throw new Error("toastDurationSec must be 2..12");
    s.set("toastDurationSec", n);
  }

  if (defaultStartTab !== undefined && defaultStartTab !== null) {
    const v = String(defaultStartTab).trim();
    const allowed = ["listings", "raions", "users", "types", "branches"];
    s.set("defaultStartTab", allowed.includes(v) ? v : "listings");
  }

  return {
    baseUrl: cleanedBaseUrl,
    themeMode: (s.get("themeMode") || "system").toString(),
    autoRefreshEnabled: !!s.get("autoRefreshEnabled"),
    autoRefreshIntervalSec: Number(s.get("autoRefreshIntervalSec") ?? 60),
    rememberEmail: !!s.get("rememberEmail"),
    lastEmail: (s.get("lastEmail") || "").toString(),
    animationsEnabled: s.get("animationsEnabled") !== false,
    loadingOverlayEnabled: s.get("loadingOverlayEnabled") !== false,
    autoOpenLastTab: s.get("autoOpenLastTab") !== false,
    lastTab: (s.get("lastTab") || "listings").toString(),
    uiScale: (s.get("uiScale") || "comfortable").toString(),
    sidebarCompact: !!s.get("sidebarCompact"),
    glassStyle: (s.get("glassStyle") || "balanced").toString(),
    uiDensity: (s.get("uiDensity") || "comfortable").toString(),
    toastEnabled: s.get("toastEnabled") !== false,
    toastDurationSec: Number(s.get("toastDurationSec") ?? 3),
    defaultStartTab: (s.get("defaultStartTab") || "listings").toString(),
  };
});

ipcMain.handle("get-auth", async () => {
  const s = await ensureStore();
  return {
    token: await getToken(),
    user: s.get("user") || null,
  };
});

ipcMain.handle("ping-api", async (_event, { baseUrl } = {}) => {
  // Lightweight check without auth.
  // Backend: GET /api/message -> { message: "Hello..." }
  const data = await apiFetch("/api/message", {
    method: "GET",
    baseUrlOverride: baseUrl,
  });
  return { ok: true, data };
});

ipcMain.handle("clear-auth", async () => {
  const s = await ensureStore();
  s.delete("token");
  s.delete("user");
  return { ok: true };
});

ipcMain.handle("login", async (_event, { email, password }) => {
  const s = await ensureStore();
  if (!email || !password) throw new Error("Введите email и пароль");

  const data = await apiFetch("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });

  // Backend returns: { message, user: {...}, token }
  if (!data || !data.token || !data.user) throw new Error("Некорректный ответ сервера");

  s.set("token", data.token);
  s.set("user", data.user);
  return { user: data.user, token: data.token };
});

ipcMain.handle("logout", async () => {
  const token = await getToken();
  const s = await ensureStore();
  try {
    if (token) {
      try {
        await apiFetch("/api/logout", { method: "POST", token });
      } catch (err) {
        // If token is already invalid/expired, still clear local auth.
        // We don't rethrow to avoid Electron handler errors.
      }
    }
  } finally {
    s.delete("token");
    s.delete("user");
  }
  return { ok: true };
});

ipcMain.handle("get-listings", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  try {
    const listings = await apiFetch("/api/listings", { method: "GET", token });
    return listings || [];
  } catch (err) {
    // If token is invalid, backend will respond 401. Clear local state.
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-raions", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const raions = await apiFetch("/api/raions", { method: "GET", token });
    return raions || [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-users", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const users = await apiFetch("/api/users", { method: "GET", token });
    return users || [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-branches", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const rows = await apiFetch("/api/branches", { method: "GET", token });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("create-branch", async (_event, payload = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    return await apiFetch("/api/branches", { method: "POST", token, body: payload });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("update-branch", async (_event, { id, payload } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  const sid = id !== undefined && id !== null ? String(id).trim() : "";
  if (!sid) throw new Error("ID филиала обязателен");
  try {
    return await apiFetch(`/api/branches/${encodeURIComponent(sid)}`, { method: "PUT", token, body: payload || {} });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("delete-branch", async (_event, { id } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  const sid = id !== undefined && id !== null ? String(id).trim() : "";
  if (!sid) throw new Error("ID филиала обязателен");
  try {
    return await apiFetch(`/api/branches/${encodeURIComponent(sid)}`, { method: "DELETE", token });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-property-types", async () => {
  // Public endpoint. No token required.
  const types = await apiFetch("/public/properties/types", { method: "GET" });
  return Array.isArray(types) ? types : [];
});

ipcMain.handle("get-districts", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const rows = await apiFetch("/api/districts", { method: "GET", token });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-subdistricts", async (_event, { districtId } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  if (districtId === undefined || districtId === null || String(districtId).trim() === "") {
    return [];
  }
  const qs = `district_id=${encodeURIComponent(String(districtId).trim())}`;
  try {
    const rows = await apiFetch(`/api/subdistricts?${qs}`, { method: "GET", token });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-jk-list", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const rows = await apiFetch("/api/jk", { method: "GET", token });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-curators", async () => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  try {
    const rows = await apiFetch("/api/curators", { method: "GET", token });
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("get-variants", async (_event, { mode = "all", id = null } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  const safeMode = mode === "mine" ? "mine" : "all";
  const qs = [];
  qs.push(`mode=${encodeURIComponent(safeMode)}`);
  if (id !== null && id !== undefined && String(id).trim() !== "") {
    qs.push(`id=${encodeURIComponent(String(id).trim())}`);
  }

  const endpoint = `/api/variants?${qs.join("&")}`;
  const variants = await apiFetch(endpoint, { method: "GET", token });
  return Array.isArray(variants) ? variants : [];
});

ipcMain.handle("get-variant-detail", async (_event, { id } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");
  const sid = id !== undefined && id !== null ? String(id).trim() : "";
  if (!sid) throw new Error("ID не указан");
  try {
    return await apiFetch(`/api/variants/${encodeURIComponent(sid)}`, { method: "GET", token });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("create-variant", async (_event, payload = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  const baseUrl = (await getBaseUrl()).replace(/\/$/, "");
  const url = `${baseUrl}/api/variants`;

  // JSON endpoint (no multer) to avoid "Unexpected field" errors on uploads.
  const body = {};
  for (const [key, value] of Object.entries(payload || {})) {
    if (value === undefined || value === null) continue;
    const v = (typeof value === "string") ? value.trim() : value;
    if (v === "") continue;
    body[key] = v;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ? (data.error || data.message) :
      (typeof data === "string" && data) ? data :
      `HTTP ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
});

// Create property with photos/documents (multipart)
ipcMain.handle("create-property-with-files", async (_event, { payload = {}, photos = [], document = null } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  const baseUrl = (await getBaseUrl()).replace(/\/$/, "");
  const url = `${baseUrl}/api/properties`;

  const form = new FormData();

  // Append simple fields from payload
  for (const [key, value] of Object.entries(payload || {})) {
    if (value === undefined || value === null) continue;
    const v = typeof value === "string" ? value.trim() : value;
    if (v === "" || v === undefined || v === null) continue;
    form.append(key, String(v));
  }

  // Append photos (fieldname must be "photos")
  const safePhotos = Array.isArray(photos) ? photos : [];
  for (const p of safePhotos) {
    if (!p || !p.base64) continue;
    const mime = p.mime || "application/octet-stream";
    const filename = p.filename || "photo";
    const buf = Buffer.from(String(p.base64), "base64");
    const blob = new Blob([buf], { type: mime });
    form.append("photos", blob, filename);
  }

  // Append one document (fieldname must be "document")
  if (document && document.base64) {
    const mime = document.mime || "application/octet-stream";
    const filename = document.filename || "document";
    const buf = Buffer.from(String(document.base64), "base64");
    const blob = new Blob([buf], { type: mime });
    form.append("document", blob, filename);
  }

  try {
    return await apiFetchFormData("/api/properties", {
      method: "POST",
      token,
      bodyFormData: form,
    });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

async function apiFetchFormData(endpoint, { method = "POST", token, bodyFormData } = {}) {
  const baseUrl = (await getBaseUrl()).replace(/\/$/, "");
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: bodyFormData,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ? (data.error || data.message) :
      (typeof data === "string" && data) ? data :
      `HTTP ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

ipcMain.handle("create-user", async (_event, payload = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  const { email, name, phone, role, password, photo } = payload || {};
  if (!email || !name || !phone || !role || !password) {
    throw new Error("Все поля (email, name, phone, role, password) обязательны");
  }

  const form = new FormData();
  form.append("email", String(email));
  form.append("name", String(name));
  form.append("phone", String(phone));
  form.append("role", String(role));
  form.append("password", String(password));

  if (photo && photo.base64) {
    const mime = photo.mime || "application/octet-stream";
    const filename = photo.filename || "photo";
    const buf = Buffer.from(String(photo.base64), "base64");
    const blob = new Blob([buf], { type: mime });
    form.append("photo", blob, filename);
  }

  try {
    return await apiFetchFormData("/api/users", { method: "POST", token, bodyFormData: form });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

ipcMain.handle("update-user", async (_event, { id, payload } = {}) => {
  const token = await getToken();
  if (!token) throw new Error("Не авторизован");

  const sid = id !== undefined && id !== null ? String(id).trim() : "";
  if (!sid) throw new Error("ID пользователя обязателен");

  const { email, name, phone, role, password, photo } = payload || {};
  if (!email || !name || !phone || !role) {
    throw new Error("Все поля (email, name, phone, role) обязательны");
  }

  const form = new FormData();
  form.append("email", String(email));
  form.append("name", String(name));
  form.append("phone", String(phone));
  form.append("role", String(role));

  if (password && String(password).trim() !== "") {
    form.append("password", String(password));
  }

  if (photo && photo.base64) {
    const mime = photo.mime || "application/octet-stream";
    const filename = photo.filename || "photo";
    const buf = Buffer.from(String(photo.base64), "base64");
    const blob = new Blob([buf], { type: mime });
    form.append("photo", blob, filename);
  }

  try {
    return await apiFetchFormData(`/api/users/${encodeURIComponent(sid)}`, { method: "PUT", token, bodyFormData: form });
  } catch (err) {
    if (err && err.status === 401) {
      const s = store;
      if (s) {
        s.delete("token");
        s.delete("user");
      }
    }
    throw err;
  }
});

function createWindow() {
  const material = winBackgroundMaterial();
  const win = new BrowserWindow({
    title: "Kurut Desktop",
    width: 1220,
    height: 760,
    minWidth: 1000,
    minHeight: 640,
    show: false,
    backgroundColor: "#0b1220",
    ...(material ? { backgroundMaterial: material } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(() => {
  if (process.platform === "win32" && process.arch !== "x64") {
    dialog.showErrorBox(
      "Kurut Desktop",
      "Эта сборка рассчитана на Windows 64-bit (x64).\nСкачайте установщик с пометкой win-x64."
    );
    app.quit();
    return;
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

