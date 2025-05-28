"use client";

import { FC, JSX, useEffect, useState } from "react";
import {
  IconBroadcast,
  IconLink,
  IconLogout,
  IconMenu2,
  IconMessage,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { Box, Divider, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import useBotStore from "@/stores/bot";

const menuData = [
  { link: "general", label: "Obecné", icon: IconSettings },
  { link: "statistics", label: "Statistiky", icon: IconReportAnalytics },
  { link: "sequences", label: "Sekvence", icon: IconMessage },
  { link: "academy-links", label: "Academy Links", icon: IconLink },
  { link: "users", label: "Uživatelé", icon: IconUsers },
  { link: "broadcast", label: "Broadcast", icon: IconBroadcast },
];

const Sidebar: FC<{ children: JSX.Element }> = ({ children }) => {
  const { signOut, getWebhookInfo } = useBotStore();
  const { pathname, query } = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => getWebhookInfo(), 600000);

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
      <header className="border-b h-20 border-gray-300 flex justify-between p-5 items-center fixed z-30 w-full bg-white">
        <div className="flex justify-center items-center gap-5">
          <img alt="logo" className="w-[100px] ml-1" src="/logo.svg" />
          <Divider color="#bbbbbb" h="40" orientation="vertical" />
          <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            {isSidebarOpen ? (
              <IconX color="#151515" />
            ) : (
              <IconMenu2 color="#151515" />
            )}
          </button>
        </div>
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

      <div className="flex h-screen pt-20 relative">
        {/* Sidebar */}
        <motion.nav
          animate={{
            x: isSidebarOpen ? 0 : isMobile ? "-100%" : -300,
            width: isSidebarOpen || isMobile ? 288 : 0,
            opacity: isSidebarOpen ? 1 : 0,
          }}
          className={`z-20 h-full bg-white border-r border-gray-300 dark:border-gray-700 fixed p-4 top-20 ${isMobile ? "left-0 w-72" : ""}`}
          initial={false}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <div className="flex-1">
            <Text fw="bold">Settings</Text>
            {settings}
          </div>
        </motion.nav>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          // eslint-disable-next-line
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-10"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <motion.div
          animate={{
            marginLeft: isMobile ? 0 : isSidebarOpen ? 288 : 0,
          }}
          className="flex-1 p-1"
          transition={{ type: "tween", duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
