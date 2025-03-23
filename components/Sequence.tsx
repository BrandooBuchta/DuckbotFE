import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Divider,
  MultiSelect,
  NumberInput,
  Switch,
  Text,
} from "@mantine/core";
import { FC, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { IconTrash } from "@tabler/icons-react";
import { toast } from "react-toastify";

import MarkdownTextarea from "./MarkdownTextarea";

import { Sequence, UpdateSequence } from "@/interfaces/sequences";
import useSequencesStore from "@/stores/sequences";
import { replaceAcademyLinks } from "@/utils/academy-links";

interface SequenceProps {
  sequence: Sequence;
}

const SequenceCard: FC<SequenceProps> = ({ sequence }) => {
  const sequencesStore = useSequencesStore();
  const [changedFields, setChangedFields] = useState<UpdateSequence>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const form = useForm<UpdateSequence>({
    initialValues: {
      ...sequence,
      startsAt: sequence?.startsAt
        ? dayjs.utc(sequence.startsAt).toDate() // Načítání přímo v UTC
        : null,
    },
  });

  const handleChange = (field: keyof UpdateSequence, value: any) => {
    const updatedValue =
      field === "startsAt" && value
        ? dayjs.utc(value).toISOString() // Při změně ukládáme jako ISO string
        : value;

    setChangedFields((prev) => ({ ...prev, [field]: updatedValue }));
    form.setFieldValue(field, updatedValue);
  };

  const updateSequence = async () => {
    setIsLoading(true);
    try {
      await sequencesStore.updateSequence(sequence.id, {
        ...changedFields,
        sendAt: changedFields.sendImmediately ? null : changedFields.sendAt,
        startsAt: changedFields.sendImmediately ? null : changedFields.startsAt,
        message:
          changedFields.message && replaceAcademyLinks(changedFields.message),
      });
      await sequencesStore.getSequences();
      toast.success("Sekvence úspěšně upravena.");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await sequencesStore.deleteSequence(sequence.id);
      await sequencesStore.getSequences();
      toast.success("Sekvence úspěšně smazána.");
      setIsDeleteLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Card
      withBorder
      className="gap-3"
      padding="md"
      radius="md"
      shadow="sm"
      w="100%"
    >
      <div className="flex justify-between">
        <Text
          contentEditable
          suppressContentEditableWarning
          onInput={({ currentTarget: { textContent } }) =>
            handleChange("name", textContent)
          }
        >
          {sequence.name}
        </Text>

        <div className="flex justify-center items-center gap-2">
          <Switch
            {...form.getInputProps("isActive", {
              type: "checkbox",
            })}
            offLabel="OFF"
            size="md"
            onChange={(e) => handleChange("isActive", e.currentTarget.checked)}
            onLabel="ON"
          />
          <Divider orientation="vertical" />
          <ActionIcon
            loading={isDeleteLoading}
            variant="subtle"
            onClick={() => handleDelete()}
          >
            <IconTrash className="text-red-600 cursor-pointer" stroke={1.5} />
          </ActionIcon>
        </div>
      </div>
      <div>
        <Text className="mb-2 font-bold text-sm">Publikum</Text>
        <div className="flex gap-5 justify-start w-full">
          <MultiSelect
            className="w-full"
            data={[
              { label: "Nezastakováno", value: "0" },
              { label: "Zastakováno", value: "1" },
              { label: "Affiliate", value: "2" },
            ]}
            {...form.getInputProps("levels", {
              type: "checkbox",
            })}
            onChange={(e) => handleChange("levels", e)}
          />
        </div>
      </div>
      <div className="flex gap-5 my-3">
        <div className="flex flex-col w-full">
          <Text className="my-2 font-bold text-sm">Opakování zprávy</Text>
          <div className="flex flex-col gap-2 justify-start w-full">
            <Switch
              label="Opakovat"
              {...form.getInputProps("repeat", {
                type: "checkbox",
              })}
              onChange={(e) => handleChange("repeat", e.currentTarget.checked)}
            />
            <NumberInput
              className="w-full"
              disabled={!(sequence.repeat || form.getValues().repeat)}
              label="Frekvence (Dny)"
              placeholder="Např. 7"
              {...form.getInputProps("interval", {
                type: "input",
              })}
              onChange={(value) => handleChange("interval", value)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <Text className="my-2 font-bold text-sm">Plánování zprávy</Text>
          <div className="flex flex-col gap-2 justify-start w-full">
            <Switch
              label="Odeslat okamžitě?"
              {...form.getInputProps("sendImmediately", {
                type: "checkbox",
              })}
              onChange={(e) =>
                handleChange("sendImmediately", e.currentTarget.checked)
              }
            />
            <DateTimePicker
              className="w-full mb-3"
              disabled={form.getValues().sendImmediately}
              label="První zprávu odeslat"
              placeholder="Vyberte datum a čas"
              value={
                form.values.startsAt
                  ? dayjs.utc(form.values.startsAt).toDate()
                  : null
              }
              onChange={(value) => {
                handleChange(
                  "startsAt",
                  value ? dayjs.utc(value).toISOString() : null,
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <Text className="font-bold text-sm mb-1">Zpráva</Text>
        <MarkdownTextarea
          className="mb-3"
          value={form.values.message || ""}
          onChange={(value) => handleChange("message", value)}
        />
        <Checkbox
          label="Má zpráva zjistit stav uživatele?"
          {...form.getInputProps("checkStatus", {
            type: "checkbox",
          })}
          onChange={(e) => handleChange("checkStatus", e.currentTarget.checked)}
        />
      </div>
      <Button
        disabled={JSON.stringify(changedFields) === "{}"}
        loading={isLoading}
        onClick={() => updateSequence()}
      >
        Uložit
      </Button>
    </Card>
  );
};

export default SequenceCard;
