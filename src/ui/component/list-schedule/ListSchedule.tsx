import { ActionIcon, Badge, Box, Group, Indicator, ScrollArea, Stack, Text } from "@mantine/core";
import { IconArrowMoveRightFilled, IconTrashXFilled } from "@tabler/icons-react";
import { DELETE_SCHEDULE } from "../../store/slices/schedule/schedule.slice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Paper from "../custom/PaperCustom";
import Nodata from "../no-data/Nodata";
import { isNowInSchedule } from "../../helpers/function.helper";
import { ESchedule } from "../../../types/enum/schedule.enum";

export default function ListSchedule() {
   const scheduleList = useAppSelector((state) => state.schedule.scheduleList);
   const dispatch = useAppDispatch();

   const handleDeleteSchedule = (index: number) => {
      dispatch(DELETE_SCHEDULE(index));
   };

   return (
      <Paper>
         <Stack>
            <Text>Lịch học đã tạo</Text>
            <ScrollArea h={200}>
               {scheduleList.length === 0 && <Nodata />}
               {scheduleList.map((item, index) => {
                  const isActive = isNowInSchedule(item);
                  return (
                     <Group key={index} py={2}>
                        <Box w={10}>{isActive && <Indicator processing={true} color="green" size={10} position="middle-end" />}</Box>
                        <Text w={70}>{ESchedule[item.day]}</Text>
                        <Badge w={90} variant="light" color="cyan" size="lg">
                           {item.startHour.toString().padStart(2, "0")}:{item.startMinute.toString().padStart(2, "0")}:
                           {item.startSecond.toString().padStart(2, "0")}
                        </Badge>
                        <IconArrowMoveRightFilled />
                        <Badge w={90} variant="light" color="green" size="lg">
                           {item.endHour.toString().padStart(2, "0")}:{item.endMinute.toString().padStart(2, "0")}:
                           {item.endSecond.toString().padStart(2, "0")}
                        </Badge>
                        <ActionIcon
                           onClick={() => {
                              handleDeleteSchedule(index);
                           }}
                           variant="light"
                           radius="xl"
                           color="red"
                        >
                           <IconTrashXFilled style={{ width: "70%", height: "70%" }} />
                        </ActionIcon>
                     </Group>
                  );
               })}
            </ScrollArea>
         </Stack>
      </Paper>
   );
}
