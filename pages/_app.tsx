import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "@/styles/globals.css";
import "dayjs/locale/cs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ToastContainer } from "react-toastify";

dayjs.extend(utc);
import type { AppProps } from "next/app";

import { createTheme, MantineProvider } from "@mantine/core";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { DatesProvider } from "@mantine/dates";

import useBotStore from "@/stores/bot";
import { setAuthTokenHeader } from "@/utils/api";

const theme = createTheme({
  // fontFamily: 'Open Sans, sans-serif',
  primaryColor: "pink",
});

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  const botStore = useBotStore();
  const token = Cookies.get("token");

  const mountedAsyncStack = async () => {
    token && setAuthTokenHeader(token);
    if (!isClient) return;

    if (!botStore.isLoggedIn) {
      console.log("botStore.isLoggedIn je false");
      if (
        !router.pathname.startsWith("/auth/sign-in") &&
        !router.pathname.startsWith("/auth/sign-up")
      ) {
        router.push("/auth/sign-in");
      }
    } else {
      if (router.pathname.includes("auth")) {
        router.push("/settings/general");
      }
    }
  };

  useEffect(() => {
    mountedAsyncStack();
  }, [botStore.isLoggedIn, router.pathname, isClient]);

  useEffect(() => {
    token && setAuthTokenHeader(token);
    setIsClient(true);
  }, []);

  return (
    <MantineProvider theme={theme}>
      <DatesProvider
        settings={{
          locale: "cs",
          firstDayOfWeek: 0,
          weekendDays: [0],
          timezone: "UTC",
        }}
      >
        <ToastContainer />
        <Component {...pageProps} />
      </DatesProvider>
    </MantineProvider>
  );
}
