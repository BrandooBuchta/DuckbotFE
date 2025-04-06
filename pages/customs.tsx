import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Octokit } from "@octokit/rest";
import {
  Box,
  Text,
  Loader,
  Button,
  Card,
  Title,
  Group,
  NumberInput,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

import useBotStore from "@/stores/bot";

interface Message {
  next_message_send_after: number;
  next_message_id: number;
  id: number;
  content: string;
  level_up_question: boolean;
  event: string;
}

const MarkdownTextarea = dynamic(
  () => import("@/components/MarkdownTextarea"),
  {
    ssr: false,
  },
);

const auth = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const octokit = new Octokit({ auth });

const owner = "BrandooBuchta";
const repo = "bot-configurator-api";
const branch = "main";
const basePath = "data";
const levels: string[] = ["Nezastakováno", "Zastakováno", "Affiliate"];

const CustomLevelPage: FC = () => {
  const { bot } = useBotStore();
  const {
    push,
    query: { level },
  } = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [sha, setSha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const path = `${basePath}/customs/${bot?.id}/level-${level}.json`;

  useEffect(() => {
    const fetchContent = async () => {
      if (!bot?.id || !level) return;

      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });

        if (!("content" in data)) throw new Error("Soubor nemá obsah");

        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const parsed = JSON.parse(content);

        setMessages(parsed.messages || []);
        setSha(data.sha);
      } catch (err: any) {
        console.error(err);
        setError("Nepodařilo se načíst level soubor.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [bot?.id, level]);

  const handleUpdate = async () => {
    try {
      const content = JSON.stringify({ messages }, null, 2);
      const encoded = Buffer.from(content).toString("base64");

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `update level-${level}.json for bot ${bot?.id}`,
        content: encoded,
        sha: sha || undefined,
        branch,
      });

      toast.update("Úspěšně upraveno!");
      push("/settings/general");
    } catch (err) {
      console.error("Chyba při ukládání:", err);
    }
  };

  const updateNextMessageSendAfter = (
    index: number,
    field: "days" | "hours" | "minutes",
    value: number,
  ) => {
    const current = messages[index].next_message_send_after || 0;
    const totalMinutes = {
      days: Math.floor(current / (24 * 60)),
      hours: Math.floor((current % (24 * 60)) / 60),
      minutes: current % 60,
    };

    totalMinutes[field] = value;
    const newTotal =
      totalMinutes.days * 24 * 60 +
      totalMinutes.hours * 60 +
      totalMinutes.minutes;

    handleChange(index, "next_message_send_after", newTotal);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...messages];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setMessages(updated);
  };

  if (!bot) return <Text>Načítání bota…</Text>;
  if (loading) return <Loader />;

  return (
    <Box className="max-w-7xl mx-auto" p="md">
      <div className="flex justify-between items-center py-3">
        <b className="flex flex-row mb-3 text-2xl gap-1 items-center">
          <img alt="logo" className="w-[100px] ml-1" src="/logo.svg" /> Edtior |{" "}
          {levels[Number(level)]}
        </b>
        <Button size="lg" variant="light" onClick={handleUpdate}>
          Uložit změny
        </Button>
      </div>
      {error && (
        <Text color="red" mb="md">
          {error}
        </Text>
      )}

      {messages.map((msg, index) => {
        const total = msg.next_message_send_after || 0;
        const days = Math.floor(total / (24 * 60));
        const hours = Math.floor((total % (24 * 60)) / 60);
        const minutes = total % 60;

        return (
          <Card
            key={msg.id || index}
            withBorder
            mb="lg"
            radius="md"
            shadow="sm"
          >
            <Title mb="xs" order={4}>
              Zpráva {index}{" "}
              {msg.level_up_question &&
                "| Tato zpráva slouží pro zjištění stavu uživatele"}
              {msg.event && `| ${msg.event}`}
            </Title>

            <MarkdownTextarea
              value={msg.content}
              onChange={(val) => handleChange(index, "content", val)}
            />

            {msg.next_message_send_after && (
              <>
                <Text className="mt-5 font-bold">Další zprávu odeslat za</Text>
                <Group grow>
                  <NumberInput
                    label="Dny"
                    min={0}
                    value={days}
                    onChange={(val) =>
                      updateNextMessageSendAfter(index, "days", val || 0)
                    }
                  />
                  <NumberInput
                    label="Hodiny"
                    max={23}
                    min={0}
                    value={hours}
                    onChange={(val) =>
                      updateNextMessageSendAfter(index, "hours", val || 0)
                    }
                  />
                  <NumberInput
                    label="Minuty"
                    max={59}
                    min={0}
                    value={minutes}
                    onChange={(val) =>
                      updateNextMessageSendAfter(index, "minutes", val || 0)
                    }
                  />
                </Group>
              </>
            )}
          </Card>
        );
      })}
    </Box>
  );
};

export default CustomLevelPage;
