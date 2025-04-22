import { Button, Center, Code, Stack, Text } from "@mantine/core";
import rootRouter from "../../router/routes";
import { useEffect, useState } from "react";
import { ROUTER } from "../../constant/router.constant";
import ButtonToggleTheme from "../../component/button/ButtonToggleTheme";
import Paper from "../../component/custom/PaperCustom";

export default function Test() {
   const [notify, setNotify] = useState<IpcEventMap["notify"]>({ title: "", message: "" });
   const [config, setConfig] = useState<string>("");
   const [count, setCount] = useState(0);

   useEffect(() => {
      const removeNotify = window.electron.onNotify((data) => {
         console.log("🪵 Notify from Main:", data);
         setNotify((prev) => {
            return { ...prev, ...data };
         });
      });

      const removeCount = window.electron.onCount((data) => {
         console.log("🪵 Count from Main:", data);
         setCount(data.count);
      });

      window.electron.getConfig().then((config) => {
         console.log("🧾 App Config:", config);
         setConfig(JSON.stringify(config));
      });

      window.electron.sendLogMessage("UI đã khởi động");

      return () => {
         removeNotify();
         removeCount();
      };
   }, []);

   return (
      <Stack p={20}>
         <Paper>
            <Stack>
               <Center>
                  <ButtonToggleTheme />
               </Center>
               <Center>
                  <Button
                     onClick={() => {
                        rootRouter.navigate(ROUTER.HOME);
                     }}
                  >
                     Go Page Home
                  </Button>
               </Center>
               <Center>
                  <Text>
                     Notify: {notify.title} | {notify.message}
                  </Text>
               </Center>
               <Center>
                  <Code block>{config}</Code>
               </Center>
               <Center>
                  <Text>Count from Main: {count}</Text>
               </Center>
            </Stack>
         </Paper>
      </Stack>
   );
}
