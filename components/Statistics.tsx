import { FC, useState, useEffect } from "react";

import StatisticCard from "./StatisticCard";

import { BotStatistic } from "@/interfaces/bot";

const STATISTICS_MOCK: BotStatistic[] = [
  {
    value: 50,
    label: "Nezastakovano",
    desc: "Ještě nezastakoval",
  },
  {
    value: 20,
    label: "Zastakovano",
    desc: "Již zastakoval",
  },
  {
    value: 2,
    label: "Affiliate",
    desc: "Zastakoval a dělá a affiliate",
  },
];

const Statistics: FC = ({}) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient)
    return (
      <div className="flex justify-evenly w-full">
        {STATISTICS_MOCK.map((e) => (
          <StatisticCard key={e.label} statistic={e} />
        ))}
        <StatisticCard
          statistic={{
            label: "Celkem",
            desc: "Celkový počet lidí",
            value: STATISTICS_MOCK.reduce(
              (acc, { value: num }) => acc + num,
              0,
            ),
          }}
        />
      </div>
    );
};

export default Statistics;
