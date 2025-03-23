import { FC, JSX, useEffect } from "react";
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconLink,
  IconLogout,
  IconMessage,
  IconQuestionMark,
  IconReportAnalytics,
  IconSettings,
  IconVariable,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Divider,
  Text,
  Tooltip,
} from "@mantine/core";
import { useRouter } from "next/router";

import Section from "./Section";

import useBotStore from "@/stores/bot";

const data = [
  { link: "vars", label: "Variables", icon: IconVariable },
  { link: "sequences", label: "Sekvence", icon: IconMessage },
  { link: "academy-links", label: "Academy Links", icon: IconLink },
  { link: "faq", label: "FAQ", icon: IconQuestionMark },
];

const menuData = [
  { link: "general", label: "Obecné", icon: IconSettings },
  { link: "statistics", label: "Statistiky", icon: IconReportAnalytics },
  { link: "sequences", label: "Sekvence", icon: IconMessage },
  { link: "academy-links", label: "Academy Links", icon: IconLink },
  { link: "faq", label: "FAQ", icon: IconQuestionMark },
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

    const interval = setInterval(handleInterval, 60000);

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

  const links = data.map((item) => (
    <a
      key={item.label}
      className={`flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors ${
        query.section === item.link && pathname.includes("docs")
          ? "text-pink-500"
          : ""
      }`}
      href={`/docs/${item.link}`}
    >
      <item.icon className="mr-2 w-5 h-5 text-pink-500" stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div className="relative">
      <header className="border-b h-20 border-gray-300 flex justify-between p-5 items-center fixed z-20 w-full bg-white">
        <Text className="text-lg font-bold">
          <b className="text-pink-500">Duckbot</b>
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
            <Divider className="my-2" />
            <Text fw="bold" pt="10">
              Docs
            </Text>
            {links}
          </div>
        </nav>
        <div className="ml-72 w-full mt-20">
          {!pathname.includes("docs") && (
            <div className="gap-3 flex flex-col relative p-5 w-full">
              <Section title="Info">
                <div className="flex w-full justify-between items-center">
                  <div>
                    <p className="font-bold">URL</p>
                    <div className="flex">
                      <p className="text-gray-500 text">{`https://ducknation.vercel.app/${bot?.isEvent ? "event" : "b"}/${bot?.id}`}</p>
                      <CopyButton
                        timeout={2000}
                        value={`https://ducknation.vercel.app/${bot?.isEvent ? "event" : "b"}/${bot?.id}`}
                      >
                        {({ copied, copy }) => (
                          <Tooltip
                            withArrow
                            label={copied ? "Copied" : "Copy"}
                            position="right"
                          >
                            <ActionIcon
                              color={copied ? "teal" : "gray"}
                              variant="subtle"
                              onClick={copy}
                            >
                              {copied ? (
                                <IconCheck size={16} />
                              ) : (
                                <IconCopy size={16} />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="light"
                      onClick={() =>
                        webhookInfo ? deleteWebhook() : setWebhook()
                      }
                    >
                      <p className="text-black mr-2">WEBHOOK: </p>
                      <b>{webhookInfo ? "ON" : "OFF"}</b>
                    </Button>
                  </div>
                </div>
              </Section>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
