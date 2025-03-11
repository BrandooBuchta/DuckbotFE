import React, { useState } from "react";
import { Progress, Button, Group, Stack, NumberInput } from "@mantine/core";

interface Element {
  id: number;
  value: number;
  label: string;
}

const colors: { [key: number]: string } = {
  0: "#FF3366",
  1: "#33CC99",
  2: "#6633FF",
  3: "#FFB7",
  4: "#CCFF",
  5: "#FF6B33",
  6: "#9933FF",
  7: "#33FF99",
  8: "#FF3399",
  9: "#3366FF",
};

const ProgressBarApp: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([
    { id: 1, value: 50, label: "Element 1" },
    { id: 2, value: 50, label: "Element 2" },
  ]);

  const adjustValues = (id: number, newValue: number) => {
    setElements((prev) => {
      const total = 100;
      const targetIndex = prev.findIndex((el) => el.id === id);

      if (targetIndex === -1) return prev;

      const adjusted = [...prev];

      adjusted[targetIndex].value = Math.max(0, Math.min(newValue, total));

      // Spočítáme zbylou hodnotu
      const remainingTotal = total - adjusted[targetIndex].value;

      const otherElements = adjusted.filter(
        (_, index) => index !== targetIndex,
      );
      const totalOtherValues = otherElements.reduce(
        (sum, el) => sum + el.value,
        0,
      );

      otherElements.forEach((el) => {
        adjusted[adjusted.findIndex((item) => item.id === el.id)].value =
          totalOtherValues > 0
            ? Math.round((el.value / totalOtherValues) * remainingTotal)
            : Math.floor(remainingTotal / otherElements.length);
      });

      // Korekce na přesných 100
      const correctedTotal = adjusted.reduce((sum, el) => sum + el.value, 0);
      const difference = total - correctedTotal;

      if (difference !== 0) {
        adjusted[targetIndex].value = Math.max(
          0,
          adjusted[targetIndex].value + difference,
        );
      }

      return adjusted;
    });
  };

  const addElement = () => {
    setElements((prev) => {
      const remaining = 100 - prev.reduce((sum, el) => sum + el.value, 0);
      const newValue = Math.floor(remaining / (prev.length + 1));

      const updated = prev.map((el) => ({
        ...el,
        value: Math.round((el.value / 100) * (100 - newValue)),
      }));

      return [
        ...updated,
        {
          id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
          value: newValue,
          label: `Element ${prev.length + 1}`,
        },
      ];
    });
  };

  const removeElement = (id: number) => {
    setElements((prev) => {
      const filtered = prev.filter((el) => el.id !== id);

      if (filtered.length === 0) return [];

      const remainingTotal = 100;
      const totalOtherValues = filtered.reduce((sum, el) => sum + el.value, 0);

      const adjusted = filtered.map((el) => ({
        ...el,
        value: Math.round((el.value / totalOtherValues) * remainingTotal),
      }));

      return adjusted;
    });
  };

  return (
    <Stack>
      <Progress.Root className="mx-5 w-[1000px]" size="xl">
        {elements.map((element, index) => (
          <Progress.Section
            key={element.id}
            color={colors[index % Object.keys(colors).length]}
            value={element.value}
          >
            <Progress.Label>
              {element.label} | {element.value}%
            </Progress.Label>
          </Progress.Section>
        ))}
      </Progress.Root>

      {elements.map((element) => (
        <Group key={element.id}>
          <NumberInput
            max={100}
            min={0}
            step={1}
            value={element.value}
            onBlur={(event) => {
              const value = parseInt(event.target.value, 10);

              if (!isNaN(value)) adjustValues(element.id, value);
            }}
          />
          <Button color="red" onClick={() => removeElement(element.id)}>
            Remove
          </Button>
        </Group>
      ))}

      <Button onClick={addElement}>Add Element</Button>
    </Stack>
  );
};

export default ProgressBarApp;
