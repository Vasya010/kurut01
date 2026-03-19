const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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
  };
});

ipcMain.handle("set-settings", async (_event, { baseUrl }) => {
  const s = await ensureStore();
  if (!baseUrl || typeof baseUrl !== "string") throw new Error("baseUrl is required");
  const cleaned = baseUrl.toString().trim().replace(/\/$/, "");
  s.set("baseUrl", cleaned);
  return { baseUrl: cleaned };
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
      await apiFetch("/api/logout", { method: "POST", token });
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

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 740,
    minWidth: 980,
    minHeight: 640,
    show: false,
    backgroundColor: "#0b1220",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

