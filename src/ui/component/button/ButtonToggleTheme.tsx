import { ActionIcon, ActionIconProps, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

type TProps = {} & ActionIconProps;

export default function ButtonToggleTheme({ ...props }: TProps) {
   const { toggleColorScheme } = useMantineColorScheme();

   return (
      <>
         <ActionIcon {...props} onClick={toggleColorScheme} size="md" variant="default" radius="xl" lightHidden>
            <IconSun stroke={1.5} size={20} />
         </ActionIcon>
         <ActionIcon {...props} onClick={toggleColorScheme} size="md" variant="default" radius="xl" darkHidden>
            <IconMoon stroke={1.5} size={20} />
         </ActionIcon>
      </>
   );
}
