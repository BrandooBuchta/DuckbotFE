import { create } from "zustand";
import { toast } from "react-toastify";

import useBotStore from "./bot";

import { FAQ, UpdateFAQ } from "@/interfaces/faq";
import { api } from "@/utils/api";

const PREFIX = "bot/faq/";

interface FAQState {
  faqs: FAQ[];
  createFAQ: () => void;
  getFAQs: () => void;
  getFAQ: (id: string) => void;
  updateFAQ: (id: string, body: UpdateFAQ) => void;
  deleteFAQ: (id: string) => void;
}

const useFAQsStore = create<FAQState>((set, get) => ({
  faqs: [],
  createFAQ: async () => {
    const bot = useBotStore.getState();

    try {
      await api.post(`${PREFIX}${bot.bot?.id}`);
      toast.success("FAQ bylo úsěpšně vytvořeno");
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getFAQs: async () => {
    const bot = useBotStore.getState();

    try {
      const { data: faqs } = await api.get<FAQ[]>(
        `${PREFIX}${bot.bot?.id}/all`,
      );

      set({
        faqs,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getFAQ: async (id) => {
    try {
      await api.post(`${PREFIX}${id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  updateFAQ: async (id, body) => {
    try {
      await api.put(`${PREFIX}${id}`, body);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  deleteFAQ: async (id) => {
    try {
      await api.delete(`${PREFIX}${id}`);
      toast.success("FAQ bylo úsěpšně smazáno");
    } catch (error) {
      toast.error(`${error}`);
    }
  },
}));

export default useFAQsStore;
