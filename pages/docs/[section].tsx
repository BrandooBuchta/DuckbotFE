import { FC } from "react";
import { GetServerSideProps } from "next";
import { Text } from "@mantine/core";

import Sidebar from "@/components/Sidebar";
import SequencesDocs from "@/components/docs/SequencesDocs";
import LinksDocs from "@/components/docs/LinksDocs";
import VariablesDocs from "@/components/docs/VariablesDocs";

const Docs: FC<{ section: string }> = ({ section }) => {
  const sections = () => {
    switch (section) {
      case "sequences":
        return <SequencesDocs />;
      case "academy-links":
        return <LinksDocs />;
      case "vars":
        return <VariablesDocs />;
      default:
        return (
          <div className="gap-3 m-5">
            <Text>No sections were found for this parametr</Text>
          </div>
        );
    }
  };

  return (
    <Sidebar>
      <div className="mx-auto max-w-2xl my-5">
        {section && sections ? sections() : <>No section</>}
      </div>
    </Sidebar>
  );
};

export default Docs;

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
