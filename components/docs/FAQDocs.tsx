import { Code, Text } from "@mantine/core";
import { IconHelp, IconQuestionMark } from "@tabler/icons-react";
import Link from "next/link";
import { FC, JSX } from "react";

interface FAQSection {
  name: string;
  descripton: string;
  icon?: JSX.Element;
  href?: string;
}

const sections: FAQSection[] = [
  {
    name: "Otázka",
    descripton: "Otázka která se zobrazí uživateli",
  },
  {
    name: "Odpověď",
    descripton: "Odpověď která se zobrazí uživateli",
  },
];

const FAQsDocs: FC = () => {
  return (
    <div>
      <Text className="text-3xl font-bold">FAQ</Text>
      <Text>
        List častokladených dotazů které se uživateli zobrazí po zadání /faq
      </Text>
      <div className="divide-y divide-solid">
        {sections.map((s, idx) => (
          <div key={idx} className="py-5">
            <div className="flex justify-between items-center">
              <Code className="text-xl text-pink-500 font-bold">{s.name}</Code>
              {s.icon}
            </div>
            <Text mt="5">{s.descripton}</Text>
            {s.href && (
              <Link
                className="pt-5 text-pink-500 hover:font-bold transition ease-in-out hover:underline"
                href={s.href}
              >
                Více...
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsDocs;
