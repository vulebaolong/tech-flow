import { app } from "electron";
import rootController from "./controller.js";
import appService, { appVariable, win } from "./services/app.service.js";

app.on("ready", () => {
   appService.createWindow();

   app.on("activate", () => {
      if (win) {
         win.show();
      } else {
         appService.createWindow();
      }
   });
});

app.on("window-all-closed", () => {
   // Chỉ thoát app nếu KHÔNG PHẢI macOS
   if (process.platform !== "darwin") {
      appService.quitApp();
   }
});

app.on("before-quit", () => {
   appVariable.isQuiting = true;
});

app.on("quit", () => {
   console.log("App fully quit");
});

rootController();
