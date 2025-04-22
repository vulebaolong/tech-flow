import { app,  BrowserWindow, shell } from "electron";
import { getPreloadPath, getUIPath } from "../path-resolver.js";
import { isDev } from "../util.js";
import updater from "electron-updater";
const { autoUpdater } = updater;

export let win: BrowserWindow | null = null;
export let appVariable = {
   isQuiting: false,
};

const appService = {
   createWindow() {
      win = new BrowserWindow({
         width: 800,
         height: 600,
         show: false,
         backgroundColor: "#1e1e1e",
         webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: getPreloadPath(),
         },
      });
      console.log({ dev: isDev() });
      if (isDev()) {
         win.loadURL("http://localhost:5123");
      } else {
         win.loadFile(getUIPath());
      }

      win.webContents.once("did-finish-load", () => {
         win?.show();
      });

      win.on("close", (e) => {
         if (!appVariable.isQuiting && process.platform === "darwin") {
            // Trên macOS: hide thay vì close
            e.preventDefault();
            win?.hide();
         } else {
            // Trên Windows/Linux: cho phép đóng luôn
            win = null;
         }
      });

      win.on("closed", () => {
         win = null;
      });

      win.webContents.setWindowOpenHandler(({ url }) => {
         // Mở các link ngoài bằng trình duyệt mặc định
         shell.openExternal(url);
         return { action: "deny" };
      });

      win.webContents.on("will-navigate", (event, url) => {
         if (win) {
            if (url !== win.webContents.getURL()) {
               event.preventDefault();
               shell.openExternal(url);
            }
         }
      });
   },
   quitApp() {
      BrowserWindow.getAllWindows().forEach((win) => {
         if (!win.isDestroyed()) win.destroy();
      });
      app.quit();
   },
   async getVersion() {
      const current = app.getVersion();
      let latest = null;

      try {
         const updateCheck = await autoUpdater.checkForUpdates();
         latest = updateCheck?.updateInfo?.version || null;
      } catch (error) {
         console.warn("⚠️ Không thể kiểm tra bản cập nhật:", error);
      }

      return { current, latest };
   },
};

export default appService;
