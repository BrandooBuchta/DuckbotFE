import { Text } from "@mantine/core";
import { FC, useState, useEffect, JSX } from "react";
import { GetServerSideProps } from "next";

import Links from "@/components/Links";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import Sequences from "@/components/Sequences";
import Statistics from "@/components/Statistics";
import General from "@/components/General";

const Settings: FC<{ section: string }> = ({ section }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sections = (): JSX.Element | undefined => {
    switch (section) {
      case "sequences":
        return (
          <div className="gap-3 m-5">
            <Section title="Sekvence">
              <Sequences />
            </Section>
          </div>
        );
      case "academy-links":
        return (
          <div className="gap-3 m-5">
            <Section title="Academy Links">
              <Links />
            </Section>
          </div>
        );
      case "statistics":
        return (
          <div className="gap-3 m-5">
            <Section title="Statistiky">
              <Statistics />
            </Section>
          </div>
        );
      case "general":
        return (
          <div className="gap-3 m-5">
            <Section title="Obecné">
              <General />
            </Section>
          </div>
        );
      default:
        return (
          <div className="gap-3 m-5">
            <Text>No sections were found for this parametr</Text>
          </div>
        );
    }
  };

  if (isClient)
    return (
      <Sidebar>
        <>{section && sections ? sections() : <>No section</>} </>
      </Sidebar>
    );
};

export default Settings;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const section = context.query.section;

  if (typeof section !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      section,
    },
  };
};
