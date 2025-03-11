import { Button, Code, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import useBotStore from "@/stores/bot";
import { UpdateBot } from "@/interfaces/bot";

interface InputDetails {
  key: keyof UpdateBot;
  label: string;
  placeholder: string;
}

interface ButtonDetails {
  label: string;
  path: string;
}

interface VariableInfo {
  name: string;
  input?: InputDetails;
  button?: ButtonDetails;
  descripton: string;
  exmaple: string;
  preview: string;
}

const variables: VariableInfo[] = [
  {
    name: "name",
    descripton: "Jméno uživatele",
    exmaple: "Ahoj, {name}!",
    preview: "Ahoj, Honza!",
  },
  {
    name: "botName",
    input: {
      key: "name",
      label: "Jméno bota",
      placeholder: "Honzův Hustle Bot",
    },
    descripton: "Jméno tvého Bota",
    exmaple: "Já jsem, {botName}!",
    preview: "Já jsem, Honzův Bot!",
  },
  {
    name: "supportContact",
    input: {
      key: "supportContact",
      label: "Kontakt",
      placeholder: "@DonSimon",
    },
    descripton:
      "Kontakt pro podporu (Uživatel tě tam bude moct kontakovat pokud bot nebude schopen pomoci)",
    exmaple: "Kontaktuj mě zde prosím {supportContact}!",
    preview: "Kontaktuj mě zde prosím @DonSimon!",
  },
  {
    name: "opportunityCall",
    descripton: "Odkaz na nejbližší Opportunity Call",
    exmaple:
      "Zde je odkaz na nejbližší Opportunity Call: [ODKAZ]({opportunityCall})",
    preview: "Zde je odkaz na nejbližší Opportunity Call: ODKAZ",
  },
  {
    name: "launchForBeginners",
    descripton: "Odkaz na nejbližší Launch For Beginners",
    exmaple:
      "Zde je odkaz na nejbližší Launch For Beginners: [ODKAZ]({launchForBeginners})",
    preview: "Zde je odkaz na nejbližší Launch For Beginners: ODKAZ",
  },
  {
    name: "buildYourBusiness",
    descripton: "Odkaz na nejbližší Build Your Business",
    exmaple:
      "Zde je odkaz na nejbližší Build Your Business: [ODKAZ]({buildYourBusiness})",
    preview: "Zde je odkaz na nejbližší Build Your Business: ODKAZ",
  },
  {
    name: "academyLink",
    descripton:
      "Tvůj Academy Link. 10% Academy Linků co bot odešle jde jako poplatek vývojářům.",
    exmaple:
      "Zde je tvůj academy link pomocí kterého se staneš spolumajitelem kasína! 🤑: [ODKAZ]({academyLink})",
    preview:
      "Zde je tvůj academy link pomocí kterého se staneš spolumajitelem kasína! 🤑: ODKAZ",
    button: {
      label: "Nastavit Academy Link",
      path: "/settings/academy-links",
    },
  },
];

const VariablesDocs: FC = () => {
  const { updateBot, bot } = useBotStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const [changedFields, setChangedFields] = useState<Partial<UpdateBot>>({});

  useEffect(() => {
    bot && form.setValues(bot);
  }, [bot]);

  const form = useForm<UpdateBot>({
    initialValues: {
      ...bot,
    },
  });

  const handleChange = (field: keyof UpdateBot, value: any) => {
    setChangedFields((prev) => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateBot(changedFields);
      toast.success("Úspěch!")
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Text className="text-3xl font-bold">Variables</Text>
      <Text>Proměnné které jsou definované pro každého bota</Text>
      <form className="divide-y divide-solid">
        {variables.map((v, idx) => (
          <div key={idx} className="py-5">
            <Code className="text-xl text-pink-500">{v.name}</Code>
            <Text mt="5">{v.descripton}</Text>
            <Text mt="20">Příklad</Text>
            <div>
              <Code>{v.exmaple}</Code>
            </div>
            <Text mt="10">Náhled</Text>
            <div>
              <Code>{v.preview}</Code>
            </div>
            {v.input && (
              <div className="mt-8 flex flex-col">
                <Text className="mb-2 font-bold">Nastavit proměnnou</Text>
                <TextInput
                  className="mb-2"
                  label={v.input.label}
                  placeholder={v.input.placeholder}
                  {...form.getInputProps(v.input.key)}
                  onChange={({ target: { value } }) =>
                    v.input?.key && handleChange(v.input?.key, value)
                  }
                />
                <Button
                  loading={isLoading}
                  w="full"
                  onClick={() => handleSubmit()}
                >
                  Nastavit
                </Button>
              </div>
            )}
            {v.button && (
              <div className="flex flex-col mt-5">
                <Button
                  w="full"
                  onClick={() => v.button?.path && push(v.button?.path)}
                >
                  {v.button.label}
                </Button>
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default VariablesDocs;
