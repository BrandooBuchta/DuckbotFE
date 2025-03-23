import { create } from "zustand";
import { toast } from "react-toastify";

import useBotStore from "./bot";

import { Sequence, UpdateSequence } from "@/interfaces/sequences";
import { api } from "@/utils/api";

const PREFIX = "bot/sequence/";

interface SequenceState {
  sequences: Sequence[];
  createSequence: () => void;
  getSequences: () => void;
  getSequence: (id: string) => void;
  updateSequence: (id: string, body: UpdateSequence) => void;
  deleteSequence: (id: string) => void;
}

const useSequencesStore = create<SequenceState>((set, get) => ({
  sequences: [],
  createSequence: async () => {
    const bot = useBotStore.getState();

    try {
      await api.post(`${PREFIX}${bot.bot?.id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getSequences: async () => {
    const bot = useBotStore.getState();

    try {
      const { data: sequences } = await api.get<Sequence[]>(
        `${PREFIX}${bot.bot?.id}/all`,
      );

      set({
        sequences: sequences.map((e) => {
          return {
            ...e,
            levels: e.levels.map((l) => String(l)),
          };
        }),
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  getSequence: async (id) => {
    try {
      await api.post(`${PREFIX}${id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  updateSequence: async (id, body) => {
    try {
      await api.put(
        `${PREFIX}${id}`,
        body.levels
          ? {
              ...body,
              levels: body.levels.map((e) => Number(e)),
            }
          : body,
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  },
  deleteSequence: async (id) => {
    try {
      await api.delete(`${PREFIX}${id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  },
}));

export default useSequencesStore;
