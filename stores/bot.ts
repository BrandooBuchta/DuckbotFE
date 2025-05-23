import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import Router from "next/router";
import { toast } from "react-toastify";

import {
  Bot,
  CMS,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
} from "@/interfaces/bot";
import { api } from "@/utils/api";

interface AuthState {
  isLoggedIn: boolean;
  bot: Bot | null;
  webhookInfo: boolean;
  signIn: (signInInput: SignInRequest) => Promise<void>;
  signUp: (input: SignUpRequest, isEvent: boolean) => Promise<void>;
  signOut: () => void;
  updateBot: (updatedBot: CMS) => Promise<void>;
  setWebhook: () => Promise<void>;
  deleteWebhook: () => Promise<void>;
  getWebhookInfo: () => Promise<void>;
}

const useBotStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      webhookInfo: false,
      bot: null,
      signIn: async (input: SignInRequest) => {
        try {
          const {
            data: { bot, token },
          } = await api.post<SignInResponse>("bot/sign-in", {
            ...input,
            password: btoa(input.password),
          });

          Cookies.set("token", token, {
            secure: true,
            sameSite: "strict",
          });

          set({
            isLoggedIn: true,
            bot,
          });
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      signOut: () => {
        Cookies.remove("token");

        set({
          isLoggedIn: false,
          bot: null,
        });
      },
      signUp: async (input, isEvent) => {
        console.log(input)
        try {
          await api.post("bot/sign-up", {
            ...input,
            password: btoa(input.password),
            isEvent,
          });

          Router.push("/auth/sign-in");
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      updateBot: async (body) => {
        const oldState = get().bot;

        if (!oldState) return;

        try {
          const { data: newState } = await api.put<Bot>(
            `bot/${get().bot?.id}`,
            body,
          );

          const bot: Bot = {
            ...oldState,
            ...newState,
          };

          oldState &&
            set({
              bot,
            });
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      setWebhook: async () => {
        try {
          await api.post(`bot/${get().bot?.id}/set-webhook`);
          await get().getWebhookInfo();
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      deleteWebhook: async () => {
        try {
          await api.delete(`bot/${get().bot?.id}/delete-webhook`);
          await get().getWebhookInfo();
        } catch (error) {
          toast.error(`${error}`);
        }
      },
      getWebhookInfo: async () => {
        try {
          const {
            data: { webhookInfo },
          } = await api.get<{ webhookInfo: boolean }>(
            `bot/${get().bot?.id}/webhook-info`,
          );

          set({
            webhookInfo,
          });
        } catch (error) {
          toast.error(`${error}`);
        }
      },
    }),
    {
      name: "duckbot-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useBotStore;
