import { FC, useState, useEffect } from "react";
import { Group, Paper, Text } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

import { BotStatistic } from "@/interfaces/bot";

const intervalOptions = [
  { value: "lastHour", label: "Nárust za minulou hodinu" },
  { value: "lastDay", label: "Nárust od včera" },
  { value: "lastWeek", label: "Nárust za minulý týden" },
  { value: "lastMonth", label: "Nárust za minulý měsíc" },
  { value: "lastYear", label: "Nárust za minulý rok" },
  { value: "total", label: "" },
  { value: "custom", label: "" },
];

type IntervalValue = (typeof intervalOptions)[number]["value"];

interface StatisticCardProps {
  statistic: BotStatistic;
  interval: IntervalValue;
}

const StatisticCard: FC<StatisticCardProps> = ({ statistic, interval }) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const DiffIcon = statistic.value > 0 ? IconArrowUpRight : IconArrowDownRight;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient)
    return (
      <Paper
        key={statistic.title}
        withBorder
        className="p-6"
        p="md"
        radius="md"
      >
        <Group justify="space-between">
          <Text
            c="dimmed"
            className="font-bold uppercase text-gray-500 dark:text-gray-400"
            size="xs"
          >
            {statistic.title}
          </Text>
        </Group>

        <Group
          align="flex-end"
          className="mt-6 flex items-end gap-2"
          gap="xs"
          mt={25}
        >
          <Text className="text-2xl font-bold leading-none">
            {statistic.value.toFixed(2)} {statistic.isPercantage && "%"}
          </Text>
          {statistic.change && (
            <Text
              className={`flex items-center leading-none text-sm font-semibold ${
                statistic.change > 0 ? "text-teal-500" : "text-red-500"
              }`}
              fw={500}
              fz="sm"
            >
              <span>{statistic.change.toFixed(2)}</span>
              <DiffIcon className="ml-1" size={16} stroke={1.5} />
            </Text>
          )}
        </Group>

        {intervalOptions.find((e) => e.value === interval) &&
          statistic.change && (
            <Text
              c="dimmed"
              className="text-xs text-gray-500 dark:text-gray-400 mt-2"
              fz="xs"
              mt={7}
            >
              {intervalOptions.find((e) => e.value === interval)?.label}
            </Text>
          )}
      </Paper>
    );
};

export default StatisticCard;
