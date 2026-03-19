const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopApi", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setSettings: (baseUrl) => ipcRenderer.invoke("set-settings", { baseUrl }),
  pingApi: (baseUrl) => ipcRenderer.invoke("ping-api", { baseUrl }),
  getAuth: () => ipcRenderer.invoke("get-auth"),
  clearAuth: () => ipcRenderer.invoke("clear-auth"),
  login: (email, password) => ipcRenderer.invoke("login", { email, password }),
  logout: () => ipcRenderer.invoke("logout"),
  getListings: () => ipcRenderer.invoke("get-listings"),
  getRaions: () => ipcRenderer.invoke("get-raions"),
  getUsers: () => ipcRenderer.invoke("get-users"),
  getPropertyTypes: () => ipcRenderer.invoke("get-property-types"),
  getVariants: (mode, id) => ipcRenderer.invoke("get-variants", { mode, id }),
  createVariant: (payload) => ipcRenderer.invoke("create-variant", payload),
});

