interface Window {
   electron: {
      onNotify: (cb: (data: IpcEventMap["notify"]) => void) => () => void;
      onCount: (cb: (data: IpcEventMap["count"]) => void) => () => void;
      getConfig: () => Promise<Record<string, any>>;
      sendLogMessage: (msg: IpcEventMap["log-message"]) => void;
      quitApp: () => void;
      getAppVersion: () => Promise<TVersion>;

      onRecordingStatus: (cb: (data: IpcEventMap["on-recording-status"]) => void) => () => void;
      onIsCheckLoop: (cb: (data: IpcEventMap["on-is-check-loop"]) => void) => () => void;
      onIsIntervalFindProcess: (cb: (data: IpcEventMap["on-interval-find-process"]) => void) => () => void;
      onNewProcess: (cb: (data: IpcEventMap["on-new-process"]) => void) => () => void;
      updateSchedule: (data: IpcEventMap["update-schedule"]) => void;
      updateSetting: (data: IpcEventMap["update-setting"]) => void;
      isFindProcess: (data: IpcEventMap["is-find-process"]) => void;
   };
}

interface IpcEventMap {
   "log-message": string;
   "get-config": Record<string, any>;
   "notify": { title: string; message: string };
   "count": { count: number };
   "quit-app": string;
   "get-app-version": TVersion;

   "on-recording-status": { found: boolean; timestamp: string; matches: TProcessMatch[] };
   "on-is-check-loop": boolean;
   "update-schedule": TSchedule[];
   "update-setting": TAppSetting;
   "is-find-process": boolean;
   "on-interval-find-process": boolean;
   "on-new-process": TFindProcess;
}

type TAppSetting = {
   checkIntervalMs: number;
   processName: string;
   cpu: number;
};

type TVersion = {
   current: string | null;
   latest: string | null;
};
