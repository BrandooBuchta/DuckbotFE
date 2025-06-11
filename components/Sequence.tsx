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
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
      startsAt: sequence?.startsAt ? new Date(sequence.startsAt) : null,
    },
  });

  const handleChange = (field: keyof UpdateSequence, value: any) => {
    let updatedValue: any;

    if (field === "startsAt" && value) {
      const dateObj = typeof value === "string" ? new Date(value) : value;

      updatedValue = dayjs(dateObj).utc().toISOString();
    } else {
      updatedValue = value;
    }

    setChangedFields((prev) => ({ ...prev, [field]: updatedValue }));
    form.setFieldValue(field, value);
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
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Card withBorder className="gap-3" radius="md" shadow="sm" w="100%">
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
          defaultValue={sequence.levels}
          onChange={(e) => handleChange("levels", e)}
        />
      </div>

      <div className="flex lg:flex-row flex-col gap-5 my-3">
        <div className="flex flex-col w-full">
          <Text className="my-2 font-bold text-sm">Opakování zprávy</Text>
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

        <div className="flex flex-col w-full">
          <Text className="my-2 font-bold text-sm">Plánování zprávy</Text>
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
            value={form.values.startsAt ? new Date(form.values.startsAt) : null}
            onChange={(value) => handleChange("startsAt", value)}
          />
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
