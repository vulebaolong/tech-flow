import { IpcRendererEvent } from "electron";
const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
   onNotify: (cb: (data: IpcEventMap["notify"]) => void) => onIpc("notify", cb),
   onCount: (cb: (data: IpcEventMap["count"]) => void) => onIpc("count", cb),
   getConfig: () => invokeIpc("get-config"),
   sendLogMessage: (msg: IpcEventMap["log-message"]) => sendIpc("log-message", msg),
   quitApp: (data: IpcEventMap["quit-app"]) => sendIpc("quit-app", data),
   getAppVersion: () => invokeIpc("get-app-version"),

   onRecordingStatus: (cb: (data: IpcEventMap["on-recording-status"]) => void) => onIpc("on-recording-status", cb),
   onIsCheckLoop: (cb: (data: IpcEventMap["on-is-check-loop"]) => void) => onIpc("on-is-check-loop", cb),
   onIsIntervalFindProcess: (cb: (data: IpcEventMap["on-interval-find-process"]) => void) => onIpc("on-interval-find-process", cb),
   onNewProcess: (cb: (data: IpcEventMap["on-new-process"]) => void) => onIpc("on-new-process", cb),
   updateSchedule: (data: IpcEventMap["update-schedule"]) => sendIpc("update-schedule", data),
   updateSetting: (data: IpcEventMap["update-setting"]) => sendIpc("update-setting", data),
   isFindProcess: (data: IpcEventMap["is-find-process"]) => sendIpc("is-find-process", data),
});

/**
 * Lắng nghe sự kiện main gửi cho FE, có return về hàm huỷ lắng
 */
function onIpc<T = any>(channel: string, callback: (payload: T) => void): () => void {
   const wrapped = (_event: IpcRendererEvent, payload: T) => {
      callback(payload);
   };
   electron.ipcRenderer.on(channel, wrapped);
   return () => electron.ipcRenderer.off(channel, wrapped);
}

/**
 * Gửi yêu cầu và chờ main process trả về kết quả (promise)
 */
function invokeIpc<T = any>(channel: keyof IpcEventMap, payload?: T): Promise<T> {
   return electron.ipcRenderer.invoke(channel, payload);
}

/**
 * Gửi một sự kiện không đòi hỏi trả về dữ liệu
 */
function sendIpc<T = any>(channel: keyof IpcEventMap, payload: T): void {
   electron.ipcRenderer.send(channel, payload);
}
