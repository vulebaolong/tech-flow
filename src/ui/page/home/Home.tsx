import { Button, Stack } from "@mantine/core";
import AddSchedule from "../../component/add-schedule/AddSchedule";
import Status from "../../component/status/Status";
import ListSchedule from "../../component/list-schedule/ListSchedule";
import Setting from "../../component/setting/Setting";
import FindProcess from "../../component/find-process/FindProcess";
import Version from "../../component/version/Version";

export default function Home() {
   return (
      <Stack p={20}>
         <Status />
         <AddSchedule />
         <ListSchedule />
         <Setting />
         <FindProcess />
         <Button
            w={`fit-content`}
            variant="subtle"
            onClick={() => {
               window?.electron?.quitApp();
            }}
         >
            Thoát
         </Button>
         <Version />
         {/*  <SelectRegion />  */}
      </Stack>
   );
}
