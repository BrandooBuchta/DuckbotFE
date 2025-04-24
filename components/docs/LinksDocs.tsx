import { Code, Text } from "@mantine/core";
import Link from "next/link";
import { FC, JSX } from "react";

interface LinksSection {
  name: string;
  descripton: string;
  icon?: JSX.Element;
  href?: string;
}

const sections: LinksSection[] = [
  {
    name: "Link Alias",
    descripton: "Pojemnování linku pro lepší orientaci.",
  },
  {
    name: "Odkaz",
    descripton: "Zde vlož svůj academy link.",
  },
  {
    name: "Poměr",
    descripton:
      "Kolik % linků půjde danému Leadrovi. Výchozí hodnota je 90%, protože 10% je poplatek za službu vývojářům. Součet všech vlastních linků musí být roven 90.",
  },
];

const LinksDocs: FC = () => {
  return (
    <div>
      <Text className="text-3xl font-bold">Academy Links</Text>
      <Text>Nastavení registračních linků</Text>
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

export default LinksDocs;
