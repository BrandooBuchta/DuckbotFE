import { FC, useState, useEffect } from "react";

import { BotStatistic } from "@/interfaces/bot";

interface StatisticCardProps {
  statistic: BotStatistic;
}

const StatisticCard: FC<StatisticCardProps> = ({ statistic }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient)
    return (
      <div className="flex flex-col items-center">
        <div className="bg-pink-100 text-pink-500 font-bold w-[80px] text-2xl aspect-square rounded-full grid place-content-center">
          {statistic.value}
        </div>
        <h3 className="font-bold text-2xl mt-2">{statistic.label}</h3>
        <h4 className="text-lg">{statistic.desc}</h4>
      </div>
    );
};

export default StatisticCard;
