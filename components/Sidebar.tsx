import { FC, JSX, useEffect } from "react";
import {
  IconLink,
  IconLogout,
  IconMessage,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
  IconVariable,
} from "@tabler/icons-react";
import Link from "next/link";
import { Box, Text } from "@mantine/core";
import { useRouter } from "next/router";

import useBotStore from "@/stores/bot";

const data = [
  { link: "vars", label: "Variables", icon: IconVariable },
  { link: "sequences", label: "Sekvence", icon: IconMessage },
  { link: "academy-links", label: "Academy Links", icon: IconLink },
];

const menuData = [
  { link: "general", label: "Obecné", icon: IconSettings },
  { link: "statistics", label: "Statistiky", icon: IconReportAnalytics },
  { link: "sequences", label: "Sekvence", icon: IconMessage },
  { link: "academy-links", label: "Academy Links", icon: IconLink },
  { link: "users", label: "Uživatelé", icon: IconUsers },
];

const Sidebar: FC<{ children: JSX.Element }> = ({ children }) => {
  const { signOut, bot } = useBotStore();
  const { pathname, query } = useRouter();
  const { setWebhook, deleteWebhook, webhookInfo, getWebhookInfo } =
    useBotStore();

  useEffect(() => {
    const handleInterval = () => {
      getWebhookInfo();
    };

    const interval = setInterval(handleInterval, 600000);

    return () => clearInterval(interval);
  }, []);

  const settings = menuData.map((item) => (
    <Link
      key={item.label}
      className={`flex items-center text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors ${
        query.section === item.link && pathname.includes("settings")
          ? "text-pink-500"
          : ""
      }`}
      href={`/settings/${item.link}`}
    >
      <item.icon className="mr-2 w-5 h-5 text-pink-500" stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <div className="relative">
      <header className="border-b h-20 border-gray-300 flex justify-between p-5 items-center fixed z-20 w-full bg-white">
        <Text className="text-lg font-bold">
          <img alt="logo" className="w-[100px] ml-1" src="/logo.svg" />
        </Text>
        <Box
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors"
          onClick={() => signOut()}
        >
          <IconLogout
            className="mr-2 w-5 h-5 text-gray-600 dark:text-gray-400"
            stroke={1.5}
          />
          <span>Logout</span>
        </Box>
      </header>
      <div className="flex h-screen relative">
        <nav className="h-full w-72 p-4 mt-20 flex flex-col border-r border-gray-300 dark:border-gray-700 fixed">
          <div className="flex-1">
            <Text fw="bold">Settings</Text>
            {settings}
          </div>
        </nav>
        <div className="ml-72 w-full mt-20">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
