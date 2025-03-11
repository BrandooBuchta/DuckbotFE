import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  IconGripVertical,
  IconTrash,
  IconPlus,
  IconUserQuestion,
} from "@tabler/icons-react";
import { Button, Text, LoadingOverlay, Loader } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

import useFAQStore from "@/stores/faq";
import { UpdateFAQ } from "@/interfaces/faq";

const FAQs: FC = () => {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const faqsStore = useFAQStore();

  useEffect(() => {
    isClient && faqsStore.getFAQs();
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleBlur = async (
    id: string,
    field: keyof UpdateFAQ,
    value: string,
  ) => {
    const faq = faqsStore.faqs.find((faq) => faq.id === id);

    if (faq && value !== faq[field]) {
      setLoading(true); // Aktivovat overlay
      const updateData: UpdateFAQ = { [field]: value };

      await faqsStore.updateFAQ(id, updateData);
      await faqsStore.getFAQs();
      toast.success("FAQ bylo úspěšně upraveno.");
      setLoading(false); // Deaktivovat overlay
    }
  };

  const updatePositions = async (
    newFAQs: { id: string; position: number }[],
  ) => {
    setLoading(true); // Aktivovat overlay
    const updates = newFAQs.map((faq, index) => ({
      id: faq.id,
      position: index,
    }));

    for (const update of updates) {
      await faqsStore.updateFAQ(update.id, { position: update.position });
    }

    await faqsStore.getFAQs();
    toast.success("Pozice byly úspěšně upraveny.");
    setLoading(false); // Deaktivovat overlay
  };

  const handleDelete = async (id: string) => {
    setLoading(true); // Aktivovat overlay
    await faqsStore.deleteFAQ(id);
    await faqsStore.getFAQs();
    setLoading(false); // Deaktivovat overlay
  };

  const handleCreate = async () => {
    setLoading(true); // Aktivovat overlay
    await faqsStore.createFAQ();
    await faqsStore.getFAQs();
    setLoading(false); // Deaktivovat overlay
  };

  return (
    <div className="w-full mt-2" style={{ position: "relative" }}>
      <LoadingOverlay
        loaderProps={{ children: <Loader size={30} /> }}
        visible={loading}
      />
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) return;

          const reorderedFAQs = Array.from(faqsStore.faqs);
          const [movedLink] = reorderedFAQs.splice(source.index, 1);

          reorderedFAQs.splice(destination.index, 0, movedLink);

          updatePositions(reorderedFAQs);
        }}
      >
        <Droppable direction="vertical" droppableId="dnd-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 w-full"
            >
              {faqsStore.faqs
                .sort((a, b) => a.position - b.position)
                .map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        className={`flex w-full items-center rounded-md border p-4 bg-white dark:bg-gray-700 mb-2 shadow-sm ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                        {...provided.draggableProps}
                      >
                        <div className="mx-5">
                          <IconUserQuestion />
                        </div>
                        <div className="mx-2 w-full">
                          <Text
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleBlur(
                                item.id,
                                "parent",
                                e.target.textContent || "",
                              )
                            }
                          >
                            {item.parent}
                          </Text>
                          <Text
                            contentEditable
                            suppressContentEditableWarning
                            c="dimmed"
                            className="overflow-scroll"
                            size="sm"
                            onBlur={(e) =>
                              handleBlur(
                                item.id,
                                "child",
                                e.target.textContent || "",
                              )
                            }
                          >
                            {item.child}
                          </Text>
                        </div>
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center justify-center h-full text-gray-600 dark:text-gray-300 px-4 gap-5"
                        >
                          <IconTrash
                            className="text-red-600"
                            stroke={1.5}
                            onClick={() => handleDelete(item.id)}
                          />
                          <IconGripVertical size={18} stroke={1.5} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
              <div className="flex justify-center">
                <Button
                  radius="xl"
                  rightSection={<IconPlus size={14} />}
                  size="md"
                  onClick={handleCreate}
                >
                  Přidat
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FAQs;
