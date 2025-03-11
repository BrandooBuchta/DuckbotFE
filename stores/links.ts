import { create } from "zustand";
import { toast } from "react-toastify";

import useBotStore from "./bot";

import { Link, UpdateLink } from "@/interfaces/links";
import { api } from "@/utils/api";

const PREFIX = "bot/academy-link/";

interface LinksState {
  links: Link[];
  createLink: () => void;
  getLinks: () => void;
  getLink: (id: string) => void;
  updateLink: (id: string, body: UpdateLink) => void;
  deleteLink: (id: string) => void;
}

const useLinksStore = create<LinksState>((set, get) => ({
  links: [],
  createLink: async () => {
    const bot = useBotStore.getState();

    try {
      await api.post(`${PREFIX}${bot.bot?.id}`);
      toast.success("Link byl úspěšně vytvořen.");
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getLinks: async () => {
    const bot = useBotStore.getState();

    try {
      const { data: links } = await api.get<Link[]>(
        `${PREFIX}${bot.bot?.id}/all`,
      );

      set({
        links,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getLink: async (id) => {
    try {
      await api.post(`${PREFIX}${id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  updateLink: async (id, body) => {
    try {
      await api.put(`${PREFIX}${id}`, body);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  deleteLink: async (id) => {
    try {
      await api.delete(`${PREFIX}${id}`);
      toast.success("Link byl úspěšně smazán.");
    } catch (error) {
      toast.error(`${error}`);
    }
  },
}));

export default useLinksStore;
