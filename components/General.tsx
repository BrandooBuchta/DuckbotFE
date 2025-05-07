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
import { IconTrash } from "@tabler/icons-react";

import ScenarioModal from "./ScenarioModal";

import useBotStore from "@/stores/bot";
import { CMS } from "@/interfaces/bot";
import { checkOrCreateLevelJson } from "@/utils/traces";
import { getDNSInstructions, handleDomainChange } from "@/utils/vercel";

const levels: string[] = ["Nezastakováno", "Zastakováno", "Affiliate"];

const General: FC = () => {
  const { updateBot, bot } = useBotStore();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dnsInstructions, setDnsInstructions] = useState<string | null>(null);

  const form = useForm<CMS>({
    initialValues: {
      videoUrl: "",
      eventCapacity: 0,
      eventLocation: "",
      domain: "",
      eventDate: "",
      eventName: "",
      lang: "cs",
      videos: [""],
    },
  });

  const fetchVerification = async () => {
    if (!bot?.domain) return;
    const result = await getDNSInstructions(bot.domain);

    if (result) setDnsInstructions(result);
  };

  const handleSubmit = async (values: CMS) => {
    setIsLoading(true);

    const oldDomain = bot?.domain ?? null;
    const newDomain = values.domain;

    try {
      if (newDomain !== undefined)
        await handleDomainChange(oldDomain, newDomain);

      const payload = {
        ...values,
        domain: values.domain === "" ? null : values.domain,
      };

      await updateBot(payload);
      toast.success("Úspěch!");
    } catch (e) {
      toast.error(`Error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bot?.domain && fetchVerification();
  }, [bot?.domain]);

  useEffect(() => {
    bot && form.setValues(bot);
  }, [bot]);

  useEffect(() => {
    if (bot) {
      form.setValues({
        ...bot,
        videos: bot.videos && bot.videos.length > 0 ? bot.videos : [""],
      });
    }
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
          <Text fw="bold" mt="md">
            Videa (iframe odkazy)
          </Text>
          {(form.values.videos || []).map((video, index) => (
            <Box key={index} className="flex items-end gap-1 mx-5">
              <TextInput
                className="flex-1"
                label={`Video #${index + 1}`}
                placeholder="https://..."
                value={video}
                onChange={(e) => {
                  const updated = [...(form.values.videos || [])];

                  updated[index] = e.currentTarget.value;
                  form.setFieldValue("videos", updated);
                }}
              />
              {form.values.videos && form.values.videos.length > 1 && (
                <Button
                  color="red"
                  onClick={() => {
                    let updated = [...(form.values.videos || [])];

                    updated.splice(index, 1);

                    // pokud poslední záznam je prázdný, smaž ho taky
                    if (
                      updated.length > 0 &&
                      updated[updated.length - 1].trim() === ""
                    ) {
                      updated = updated.slice(0, -1);
                    }

                    form.setFieldValue(
                      "videos",
                      updated.length > 0 ? updated : [""],
                    );
                  }}
                >
                  <IconTrash size={16} />
                </Button>
              )}
            </Box>
          ))}
          <Button
            variant="light"
            className="mx-5"
            onClick={() => {
              const current = form.values.videos || [];

              // přidá pouze pokud poslední není prázdný (aby se nevrstvily prázdné)
              if (
                current.length === 0 ||
                current[current.length - 1].trim() !== ""
              ) {
                form.setFieldValue("videos", [...current, ""]);
              }
            }}
          >
            + Přidat video
          </Button>

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
            label="Doména"
            placeholder="ducknation.io"
            {...form.getInputProps("domain")}
          />

          {dnsInstructions && (
            <Box bg="gray.1" mt="xs" p="sm" style={{ whiteSpace: "pre-wrap" }}>
              <Text fw="bold">DNS záznamy pro ověření domény:</Text>
              <Text>{dnsInstructions}</Text>
            </Box>
          )}
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
