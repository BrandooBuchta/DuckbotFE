import { FC, useEffect, useState } from "react";
import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "react-toastify";

import SequenceCard from "./Sequence";

import useSequencesStore from "@/stores/sequences";

const Sequences: FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sequencesStore = useSequencesStore();

  useEffect(() => {
    isClient && sequencesStore.getSequences();
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addSequence = async () => {
    setIsLoading(true);
    try {
      await sequencesStore.createSequence();
      await sequencesStore.getSequences();
      toast.success("Sekvence úspěšně přidána.");
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="w-full mt-2" style={{ position: "relative" }}>
      <div className="w-full gap-5 flex flex-col justify-center items-center">
        {sequencesStore.sequences
          .filter((e) => !e.name.includes("Event"))
          .sort((a, b) => a.position - b.position)
          .map((s) => (
            <SequenceCard key={s.id} sequence={s} />
          ))}
        <ActionIcon
          loading={isLoading}
          mt="10"
          radius="xl"
          size="xl"
          onClick={() => addSequence()}
        >
          <IconPlus />
        </ActionIcon>
      </div>
    </div>
  );
};

export default Sequences;
