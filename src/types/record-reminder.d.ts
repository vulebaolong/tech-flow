type TProcessMatch = {
   pid: string;
   ppid: string;
   user: string;
   cpu: number;
   mem: string;
   elapsed: string;
   commandShort: string;
   commandFull: string;
};

type TcheckMacScreenRecording = {
   processName: string;
   cpu: number;
   callback: (result: IpcEventMap["on-recording-status"]) => void;
};

type TSchedule = {
   day: number;
   startHour: number;
   startMinute: number;
   startSecond: number;
   endHour: number;
   endMinute: number;
   endSecond: number;
};

type TFindProcess = {
   pid: string;
   ppid: string;
   user: string;
   cpu: string;
   mem: string;
   elapsed: string;
   started: string;
   memory: string;
   status: string;
   name: string;
   command: string;
};


