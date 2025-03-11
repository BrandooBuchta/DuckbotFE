import { Divider, Switch, Text } from "@mantine/core";
import {
  IconArrowRight,
  IconCalendar,
  IconCalendarCheck,
  IconCalendarRepeat,
  IconMessage,
  IconRepeat,
  IconRepeatOnce,
  IconStatusChange,
  IconUser,
  IconUserFilled,
  IconUsersGroup,
} from "@tabler/icons-react";
import { FC, JSX } from "react";

interface SequenceSection {
  name: string;
  descripton: string;
  subSections?: SequenceSection[];
  icon?: JSX.Element;
}

const sections: SequenceSection[] = [
  {
    name: "Alias",
    descripton:
      "Každá sekvence má svůj Alias pomocí kterého se dá pojmenovat pro lepší orientaci.",
  },
  {
    name: "Aktivita",
    descripton:
      "Každá sekvence musí být aktivní (ON/OFF) aby se odesílala, pokud není tak bude ignorována.",
    icon: <Switch offLabel="OFF" size="md" onLabel="ON" />,
  },
  {
    name: "Publikum",
    icon: <IconUsersGroup size="15px" stroke={1.5} />,
    descripton:
      "Pubikum sekvence rozliší jestli má zpráva příjít již zaregistrovaným klientům, novým klientům nebo klidně oboum zároveň.",
    subSections: [
      {
        icon: <IconUserFilled size="15px" stroke={1.5} />,
        name: "Pro stávající klienty",
        descripton:
          "Zaškrtnutím této možnosti se zpráva odešle pouze těm, co odpověděli na ''Check Status'' zprávu kladně.",
      },
      {
        icon: <IconUser size="15px" stroke={1.5} />,
        name: "Pro nové klienty",
        descripton:
          "Zaškrtnutím této možnosti se zpráva odešle pouze těm, co odpověděli na ''Check Status'' zprávu záporně nebo na ní ještě neodpověděli vůbec.",
      },
    ],
  },
  {
    name: "Opakování zprávy",
    icon: <IconRepeat size="15px" stroke={1.5} />,
    descripton: "Nastavení parametrů pro opakování zprávy",
    subSections: [
      {
        name: "Opakovat",
        descripton: "Zapnutí opakování",
        icon: <IconCalendarRepeat size="15px" stroke={1.5} />,
      },
      {
        name: "Frekvence",
        descripton: "Kolikrát se má daná zpráva opakovat (Interva je ve dnech)",
        icon: <IconRepeatOnce size="15px" stroke={1.5} />,
      },
    ],
  },
  {
    name: "Plánování zprávy",
    descripton: "Nastavení parametrů pro opakování zprávy",
    icon: <IconCalendar size="15px" stroke={1.5} />,
    subSections: [
      {
        name: "Odeslat okamžitě",
        descripton: "Zpráva se odešle nejpozději jednu minutu od uložení",
        icon: <IconArrowRight size="15px" stroke={1.5} />,
      },
      {
        name: "První zprávu odeslat",
        descripton: "Datum odeslání první zprávy.",
        icon: <IconCalendarCheck size="15px" stroke={1.5} />,
      },
    ],
  },
  {
    name: "Zpráva",
    descripton: "Nastavení parametrů pro opakování zprávy",
    icon: <IconMessage size="15px" stroke={1.5} />,
    subSections: [
      {
        name: "Obsah zprávy",
        descripton: "I tady funguje Markdown a Proměnné",
        icon: <IconMessage size="15px" stroke={1.5} />,
      },
      {
        name: "Má zpráva zjistit stav uživatele?",
        descripton:
          "Na tuto zprávu musí uživatel vždy odpovědět ANO nebo NE, můžeme pomocí toho později filtrovat publikum.",
        icon: <IconStatusChange size="15px" stroke={1.5} />,
      },
    ],
  },
];

const SequencesDocs: FC = () => {
  return (
    <div>
      <Text className="text-3xl font-bold">Sequences</Text>
      <Text>
        Sekvence jsou zprávy které uživateli pomůžou provést konverzi
        (Registrace)
      </Text>
      <div className="divide-y divide-solid">
        {sections.map((s, idx) => (
          <div key={idx} className="py-5">
            <div className="flex justify-between items-center">
              <Text className="text-xl text-pink-500 font-bold">{s.name}</Text>
              {s.icon}
            </div>
            <Text mt="5">{s.descripton}</Text>
            <div className="divide-y divide-solid">
              {s.subSections &&
                s.subSections.map((ss, ssIdx) => (
                  <div key={ssIdx} className="py-5 ml-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Text className="text-lg text-pink-500 font-bold">
                        {ss.name}
                      </Text>
                      {ss.icon && (
                        <>
                          <Divider orientation="vertical" />
                          {ss.icon}
                        </>
                      )}
                    </div>
                    <Text className="text-sm">{ss.descripton}</Text>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SequencesDocs;
