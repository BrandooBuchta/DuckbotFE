import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoin,
  IconDiscount2,
  IconReceipt2,
  IconUserPlus,
} from "@tabler/icons-react";
import { Group, Paper, SimpleGrid, Text } from "@mantine/core";

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

const data = [
  { title: "Revenue", icon: "receipt", value: "13,456", diff: 34 },
  { title: "Profit", icon: "coin", value: "4,145", diff: -13 },
  { title: "Coupons usage", icon: "discount", value: "745", diff: 18 },
  { title: "New customers", icon: "user", value: "188", diff: -30 },
] as const;

export function StatsGrid() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper key={stat.title} withBorder className="p-6" p="md" radius="md">
        <Group justify="space-between">
          <Text
            c="dimmed"
            className="font-bold uppercase text-gray-500 dark:text-gray-400"
            size="xs"
          >
            {stat.title}
          </Text>
          <Icon
            className="text-gray-400 dark:text-gray-500"
            size={22}
            stroke={1.5}
          />
        </Group>

        <Group
          align="flex-end"
          className="mt-6 flex items-end gap-2"
          gap="xs"
          mt={25}
        >
          <Text className="text-2xl font-bold leading-none">{stat.value}</Text>
          <Text
            className={`flex items-center leading-none text-sm font-semibold ${
              stat.diff > 0 ? "text-teal-500" : "text-red-500"
            }`}
            fw={500}
            fz="sm"
          >
            <span>{stat.diff}%</span>
            <DiffIcon className="ml-1" size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text
          c="dimmed"
          className="text-xs text-gray-500 dark:text-gray-400 mt-2"
          fz="xs"
          mt={7}
        >
          Compared to previous month
        </Text>
      </Paper>
    );
  });

  return (
    <div className="p-6">
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}
