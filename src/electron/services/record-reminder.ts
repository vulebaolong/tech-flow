import { helperRecordReminder } from "../helpers/function.helper.js";
import { ipcEmit } from "../util.js";
import { win } from "./app.service.js";

let currentIntervalMs = 1000;
let findProcessIntervalMs = 1000;
let checkInterval: NodeJS.Timeout | null = null;
let cpu = 1;
let processName = "VTEncoderXPCService";

let findProcessInterval: NodeJS.Timeout | null = null;
let scheduledTimeouts: NodeJS.Timeout[] = [];

let activeSchedule: TSchedule[] = [];

const recordReminderService = {
   startCheckLoop() {
      // console.log("🪵 startCheckLoop");
      if (checkInterval) return;
      checkInterval = setInterval(() => {
         helperRecordReminder.checkMacScreenRecording({
            cpu: cpu,
            processName: processName,
            callback: (result) => {
               // console.log(result);
               if (!result.found) {
                  helperRecordReminder.showPersistentNotification();
                  ipcEmit("on-recording-status", result, win);
               } else {
                  helperRecordReminder.hidePersistentNotification();
                  ipcEmit("on-recording-status", result, win);
               }
            },
         });
      }, currentIntervalMs);
      ipcEmit("on-is-check-loop", true, win);
      console.log("🔁 startCheckLoop");
   },
   clearIntervalCheckLoop() {
      // console.log("🪵 clearIntervalCheckLoop");
      if (checkInterval) clearInterval(checkInterval);
      checkInterval = null;
   },
   restartCheckLoop() {
      // console.log("🪵 restartCheckLoop");
      if (checkInterval === null) return;
      recordReminderService.clearIntervalCheckLoop();
      recordReminderService.startCheckLoop();
   },
   stopCheckLoop() {
      // console.log("🪵 stopCheckLoop");
      helperRecordReminder.hidePersistentNotification();
      recordReminderService.clearIntervalCheckLoop();
      ipcEmit("on-is-check-loop", false, win);
      console.log("⏹️ stopCheckLoop");
   },
   stopFindProcessLoop() {
      // console.log("🪵 stopFindProcessLoop");
      if (findProcessInterval) clearInterval(findProcessInterval);
      findProcessInterval = null;
      console.log("⏹️ Dừng tìm process");
   },
   scheduleAllCheckWindows() {
      console.log("🪵 scheduleAllCheckWindows");
      scheduledTimeouts.forEach(clearTimeout);
      scheduledTimeouts = [];

      const now = new Date();

      activeSchedule.forEach(({ day, startHour, startMinute, startSecond, endHour, endMinute, endSecond }) => {
         const nextStart = new Date();
         nextStart.setHours(startHour, startMinute, startSecond, 0);
         nextStart.setDate(now.getDate() + ((7 + day - now.getDay()) % 7));

         const nextEnd = new Date(nextStart);
         nextEnd.setHours(endHour, endMinute, endSecond, 0);

         const startDelay = nextStart.getTime() - now.getTime();
         const endDelay = nextEnd.getTime() - now.getTime();

         if (startDelay > 0) {
            scheduledTimeouts.push(
               setTimeout(() => {
                  recordReminderService.startCheckLoop();

                  scheduledTimeouts.push(
                     setTimeout(() => {
                        recordReminderService.stopCheckLoop();
                     }, nextEnd.getTime() - nextStart.getTime())
                  );
               }, startDelay)
            );
         } else if (now >= nextStart && now < nextEnd) {
            recordReminderService.startCheckLoop();

            scheduledTimeouts.push(
               setTimeout(() => {
                  recordReminderService.stopCheckLoop();
               }, endDelay)
            );
         }
      });
   },
   updateSchedule(scheduleUpdate: IpcEventMap["update-schedule"]) {
      console.log("🪵 updateSchedule");
      activeSchedule = scheduleUpdate;
      recordReminderService.stopCheckLoop();
      recordReminderService.scheduleAllCheckWindows();
   },
   updateSetting(setting: IpcEventMap["update-setting"]) {
      console.log("🪵 updateSetting");
      if (setting) {
         currentIntervalMs = Number(setting.checkIntervalMs) > 100 ? Number(setting.checkIntervalMs) : 100;
         processName = setting.processName;
         cpu = setting.cpu;
         recordReminderService.restartCheckLoop();
      }
   },
   startFindProcessLoop() {
      if (findProcessInterval) return;
      findProcessInterval = setInterval(() => {
         ipcEmit("on-interval-find-process", true, win);

         helperRecordReminder.detectNewProcesses((newList) => {
            newList.forEach((proc) => {
               console.log("🆕 Process mới:", proc);
               ipcEmit("on-new-process", proc, win);
            });
         });
      }, findProcessIntervalMs);
      console.log("🔁 Bắt đầu tìm process");
   },
   isFindProcess(isFindProcess: boolean) {
      if (isFindProcess) {
         recordReminderService.startFindProcessLoop();
      } else {
         recordReminderService.stopFindProcessLoop();
      }
   },
};

export default recordReminderService;
