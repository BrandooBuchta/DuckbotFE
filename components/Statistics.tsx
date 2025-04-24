import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";

import StatisticCard from "./StatisticCard";

import { BotStatistic } from "@/interfaces/bot";
import { api } from "@/utils/api";
import useBotStore from "@/stores/bot";

const Statistics: FC = ({}) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<BotStatistic[]>([]);
  const { bot } = useBotStore();

  const getStatistics = async () => {
    try {
      const { data } = await api.get<BotStatistic[]>(
        `bot/statistics/${bot?.id}`,
      );

      setStatistics(data);
    } catch (e) {
      toast.error(`Error: ${e}`);
    }
  };

  useEffect(() => {
    setIsClient(true);
    getStatistics();
  }, []);

  if (isClient)
    return (
      <div className="flex w-full my-10">
        {statistics.map((e) => (
          <StatisticCard key={e.title} statistic={e} />
        ))}
      </div>
    );
};

export default Statistics;
