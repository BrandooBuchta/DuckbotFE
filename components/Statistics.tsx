import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SimpleGrid, Select, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

import StatisticCard from "./StatisticCard";

import { BotStatistic } from "@/interfaces/bot";
import { api } from "@/utils/api";
import useBotStore from "@/stores/bot";

const intervalOptions = [
  { value: "lastHour", label: "Poslední hodina" },
  { value: "lastDay", label: "Poslední den" },
  { value: "lastWeek", label: "Poslední týden" },
  { value: "lastMonth", label: "Poslední měsíc" },
  { value: "lastYear", label: "Poslední rok" },
  { value: "total", label: "Celkově" },
  { value: "custom", label: "Vlastní rozsah" },
];

type IntervalValue = (typeof intervalOptions)[number]["value"];

const Statistics: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [statistics, setStatistics] = useState<BotStatistic[]>([]);
  const [interval, setInterval] = useState<IntervalValue>("total");
  const [customRange, setCustomRange] = useState<
    [string | null, string | null]
  >([null, null]);

  const { bot } = useBotStore();

  const getStatistics = async () => {
    if (!bot?.id) return;

    try {
      const params = new URLSearchParams({ interval });

      if (interval === "custom" && customRange[0] && customRange[1]) {
        params.append("start", customRange[0].toString());
        params.append("end", customRange[1].toString());
      }

      const { data } = await api.get<BotStatistic[]>(
        `bot/statistics/${bot.id}?${params.toString()}`,
      );

      setStatistics(data);
    } catch (e) {
      toast.error(`Chyba při načítání statistik: ${e}`);
    }
  };

  useEffect(() => {
    setIsClient(true);
    getStatistics();
  }, [interval, customRange]);

  if (!isClient) return null;

  return (
    <Stack>
      <Select
        data={intervalOptions}
        label="Zvolte časový interval"
        value={interval}
        onChange={(val) => setInterval(val || "total")}
      />

      {interval === "custom" && (
        <DatePickerInput
          label="Vlastní rozsah"
          type="range"
          value={customRange}
          onChange={(e) => setCustomRange(e)}
        />
      )}

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {statistics.map((e) => (
          <StatisticCard key={e.title} interval={interval} statistic={e} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Statistics;
