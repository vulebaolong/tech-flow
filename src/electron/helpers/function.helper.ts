import { exec } from "child_process";
import { app, BrowserWindow, ipcMain, screen, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

let previousProcesses = new Set();
let initialized = false;

let warningWindow: BrowserWindow | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const helperRecordReminder = {
   checkMacScreenRecording({ callback, processName, cpu }: TcheckMacScreenRecording) {
      exec("ps -eo pid=,ppid=,user=,%cpu=,%mem=,etime=,comm=,command=", (err, stdout) => {
         const now = new Date().toISOString();
         if (err) {
            return callback({
               found: false,
               timestamp: now,
               matches: [],
            });
         }

         const lines = stdout.trim().split("\n");

         const matches = lines
            .map((line) => line.trim())
            .filter((line) => line.includes(processName))
            .map((line) => {
               const parts = line.trim().split(/\s+/);
               return {
                  pid: parts[0],
                  ppid: parts[1],
                  user: parts[2],
                  cpu: parseFloat(parts[3]), // ✨ ép kiểu để so sánh
                  mem: parts[4],
                  elapsed: parts[5],
                  commandShort: parts[6],
                  commandFull: parts.slice(7).join(" "),
               };
            })
            .filter((proc) => proc.cpu > cpu); // ✨ chỉ lấy những process có %CPU > 1

         if (matches.length > 0) {
            return callback({
               found: true,
               timestamp: now,
               matches,
            });
         }

         return callback({
            found: false,
            timestamp: now,
            matches: [],
         });
      });
   },
   showPersistentNotification() {
      if (warningWindow) return;

      warningWindow = new BrowserWindow({
         width: 360,
         height: 70,
         frame: false,
         alwaysOnTop: true,
         resizable: false,
         skipTaskbar: true,
         transparent: false,
         focusable: false,
         hasShadow: true,
         x: 0,
         y: 1000,
         webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
         },
      });

      warningWindow.loadFile(path.join(__dirname, "../html/notification.html"));
   },
   hidePersistentNotification() {
      if (warningWindow) {
         warningWindow.close();
         warningWindow = null;
      }
   },
   detectNewProcesses(callback: (newProcesses: TFindProcess[]) => void) {
      const psCommand = `ps -eo pid=,ppid=,user=,%cpu=,%mem=,etime=,start=,rss=,stat=,comm=,command=`;

      exec(psCommand, (err, stdout) => {
         if (err) {
            console.error("❌ Lỗi khi chạy lệnh ps:", err);
            return callback([]);
         }

         const lines = stdout.trim().split("\n");
         const newProcesses = [];

         for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const parts = trimmed.match(/^(\d+)\s+(\d+)\s+(\S+)\s+([\d.]+)\s+([\d.]+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
            if (!parts) continue;

            const [_full, pid, ppid, user, cpu, mem, etime, start, rss, stat, _comm, commandFull] = parts;

            const key = `${pid}-${commandFull}`;
            const name = path.basename(commandFull);
            if (name === "ps" || commandFull.includes("ps -eo")) continue;

            if (initialized && !previousProcesses.has(key)) {
               newProcesses.push({
                  pid,
                  ppid,
                  user,
                  cpu: `${cpu}%`,
                  mem: `${mem}%`,
                  elapsed: etime,
                  started: start,
                  memory: `${rss} KB`,
                  status: stat,
                  name, // dùng tên chính xác
                  command: commandFull,
               });
            }

            previousProcesses.add(key);
         }

         if (!initialized) {
            initialized = true;
            return callback([]);
         }

         callback(newProcesses);
      });
   },
};
