import appService from "./services/app.service.js";
import demoService from "./services/demo.service.js";
import recordReminderService from "./services/record-reminder.js";
import { ipcOnHandle, ipcOnRequest } from "./util.js";

export default function rootController() {
   ipcOnRequest("get-config", demoService.getConfig);
   ipcOnHandle("log-message", demoService.logMessage);
   
   
   ipcOnHandle("update-schedule", recordReminderService.updateSchedule);
   ipcOnHandle("update-setting", recordReminderService.updateSetting);
   ipcOnHandle("is-find-process", recordReminderService.isFindProcess);
   
   ipcOnHandle("quit-app", appService.quitApp);
   ipcOnRequest("get-app-version", appService.getVersion);
}
