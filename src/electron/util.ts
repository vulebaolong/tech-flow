import { BrowserWindow, ipcMain, WebFrameMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { getUIPath } from "./path-resolver.js";

export function isDev(): Boolean {
   return process.env.NODE_ENV === "development";
}

/**
 * Đăng ký lắng nghe có trả dữ liệu (promise)
 */
export function ipcOnRequest<Key extends keyof IpcEventMap>(key: Key, handler: (payload: IpcEventMap[Key]) => Promise<any>) {
   ipcMain.handle(key, (event, payload) => {
      validateEventFrame(event.senderFrame);
      return handler(payload);
   });
}

/**
 * Đăng ký lắng nghe không cần trả dữ liệu
 */
export function ipcOnHandle<Key extends keyof IpcEventMap>(key: Key, handler: (payload: IpcEventMap[Key]) => void) {
   ipcMain.on(key, (event, payload) => {
      validateEventFrame(event.senderFrame);
      return handler(payload);
   });
}

/**
 * Chủ đồng gửi dữ liệu cho FE, FE sẽ lắng nghe window.electron.(Key extends keyof IpcEventMap)
 */
export function ipcEmit<Key extends keyof IpcEventMap>(key: Key, payload: IpcEventMap[Key], win: BrowserWindow | null) {
   win?.webContents?.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain | null) {
   if (!frame) {
      throw new Error("Not frame");
   }

   // Cho phép trong dev localhost
   if (isDev() && new URL(frame.url).host === "localhost:5123") {
      return;
   }

   const framePath = fileURLToPath(frame.url);
   const expectedPath = path.resolve(getUIPath()); // đảm bảo tuyệt đối

   const normalizedFrame = path.normalize(framePath);
   const normalizedExpected = path.normalize(expectedPath);

   console.log("🪵 Event frame:", { normalizedFrame, normalizedExpected });

   if (normalizedFrame !== normalizedExpected) {
      console.warn("⚠️ Không khớp URL:", { normalizedFrame, normalizedExpected });
      throw new Error("Malicious event");
   }
}
