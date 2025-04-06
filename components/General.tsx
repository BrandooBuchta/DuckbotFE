import { FC, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Box,
  TextInput,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { toast } from "react-toastify";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/router";

import ScenarioModal from "./ScenarioModal";

import useBotStore from "@/stores/bot";
import { CMS } from "@/interfaces/bot";
import { checkOrCreateLevelJson } from "@/utils/traces";

const levels: string[] = ["Nezastakováno", "Zastakováno", "Affiliate"];

const General: FC = () => {
  const { updateBot, bot } = useBotStore();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<CMS>({
    initialValues: {
      videoUrl: "",
      eventCapacity: 0,
      eventLocation: "",
      eventDate: "",
      eventName: "",
      lang: "cs",
      supportContact: "",
    },
  });

  const handleSubmit = async (values: CMS) => {
    setIsLoading(true);

    try {
      await updateBot(values);
      toast.success("Úspěch!");
    } catch (e) {
      toast.error(`Error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bot && form.setValues(bot);
  }, [bot]);

  if (bot)
    return (
      <Box className="w-full mt-2" style={{ position: "relative" }}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Text fw="bolder" mb="0" size="md">
            Upravit zprávy levelu
          </Text>

          <Button.Group className="gap-1">
            {levels.map((label, idx) => (
              <Button
                key={idx}
                size="compact-md"
                variant="light"
                onClick={async () => {
                  const { redirectUrl } = await checkOrCreateLevelJson(
                    bot.id,
                    bot.lang,
                    bot.isEvent,
                    idx,
                  );

                  push(redirectUrl);
                }}
              >
                {label}
              </Button>
            ))}
          </Button.Group>

          {!bot?.isEvent && (
            <TextInput label="Alias" {...form.getInputProps("name")} />
          )}
          <TextInput
            description={
              form.values.lang && (
                <>
                  <ScenarioModal lang={form.values.lang} />
                </>
              )
            }
            label="Video URL"
            {...form.getInputProps("videoUrl")}
          />
          {bot?.isEvent && (
            <>
              <TextInput
                label="Název Eventu"
                {...form.getInputProps("eventName")}
              />
              <NumberInput
                label="Kapacita Eventu"
                {...form.getInputProps("eventCapacity")}
              />
              <TextInput
                label="Lokace Eventu"
                {...form.getInputProps("eventLocation")}
              />
              <DateInput
                label="Event Date"
                value={
                  form.values.eventDate ? new Date(form.values.eventDate) : null
                }
                onChange={(date) =>
                  form.setFieldValue(
                    "eventDate",
                    date ? date.toISOString() : "",
                  )
                }
              />
            </>
          )}
          <Select
            data={[
              { value: "cs", label: "Czech" },
              { value: "en", label: "English" },
              { value: "esp", label: "Spanish" },
              { value: "sk", label: "Slovak" },
            ]}
            label="Language"
            {...form.getInputProps("lang")}
          />
          <TextInput
            label="Support Contact"
            {...form.getInputProps("supportContact")}
          />

          <Button loading={isLoading} mt="sm" type="submit">
            Uložit
          </Button>
        </form>
      </Box>
    );
};

export default General;
