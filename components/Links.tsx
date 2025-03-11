import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  IconGripVertical,
  IconLink,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import {
  Button,
  Text,
  LoadingOverlay,
  Loader,
  Progress,
  NumberInput,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { debounce } from "lodash";

import useLinksStore from "@/stores/links";
import { UpdateLink } from "@/interfaces/links";
import { toast } from "react-toastify";

const colors: { [key: number]: string } = {
  0: "#FF3366",
  1: "#33CC99", // Mint green
  2: "#6633FF", // Electric purple
  3: "#33FF99", // Golden yellow
  4: "#CCFF", // Bright cyan
  5: "#FF6B33", // Coral orange
  6: "#9933FF", // Rich violet
  7: "#33FF99", // Spring green
};

const Links: FC = () => {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const linksStore = useLinksStore();

  useEffect(() => {
    isClient && linksStore.getLinks();
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBlur = async (
    id: string,
    field: keyof UpdateLink,
    value: string,
  ) => {
    const link = linksStore.links.find((link) => link.id === id);

    if (link && value !== link[field]) {
      setLoading(true);
      const updateData: UpdateLink = { [field]: value };

      await linksStore.updateLink(id, updateData);
      await linksStore.getLinks();
      toast.success("Úspěšně jsme upravili odkaz");
      setLoading(false);
    }
  };

  const updatePositions = async (
    newLinks: { id: string; position: number }[],
  ) => {
    setLoading(true); // Aktivovat overlay
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      position: index,
    }));

    for (const update of updates) {
      await linksStore.updateLink(update.id, { position: update.position });
    }

    await linksStore.getLinks();
    toast.success("Úspěšně jsme upravili pozice");
    setLoading(false); // Deaktivovat overlay
  };

  const handleDelete = async (id: string) => {
    setLoading(true); // Aktivovat overlay
    await linksStore.deleteLink(id);
    await linksStore.getLinks();
    setLoading(false); // Deaktivovat overlay
  };

  const handleCreate = async () => {
    setLoading(true); // Aktivovat overlay
    await linksStore.createLink();
    await linksStore.getLinks();
    setLoading(false); // Deaktivovat overlay
  };

  const updateShare = debounce(async (id: string, share: number) => {
    setLoading(true);

    const linksCopy = [...linksStore.links];
    const linkIndex = linksCopy.findIndex((link) => link.id === id);

    if (linkIndex === -1) {
      toast.error("Link not found");
      setLoading(false);

      return;
    }

    linksCopy[linkIndex].share = share;

    const totalShares = linksCopy.reduce((sum, link) => sum + link.share, 0);

    if (totalShares !== 90) {
      setIsError(true);
      setLoading(false);

      return;
    } else setIsError(false);

    await linksStore.updateLink(id, { share });
    await linksStore.getLinks();

    setLoading(false);
  }, 500);

  return (
    <div className="w-full mt-2" style={{ position: "relative" }}>
      <LoadingOverlay
        loaderProps={{ children: <Loader size={30} /> }}
        visible={loading}
      />
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) return;

          const reorderedLinks = Array.from(linksStore.links);
          const [movedLink] = reorderedLinks.splice(source.index, 1);

          reorderedLinks.splice(destination.index, 0, movedLink);

          updatePositions(reorderedLinks);
        }}
      >
        <Droppable direction="vertical" droppableId="dnd-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 w-full"
            >
              {linksStore.links
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
                          <IconLink />
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
                          <NumberInput
                            defaultValue={item.share}
                            label="Poměr (%)"
                            w="100px"
                            onChange={(val) =>
                              typeof val === "number" &&
                              updateShare(item.id, val)
                            }
                          />
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
              {isError && (
                <Text c="red" fw="bold" size="sm" ta="center">
                  *Součet všech podílů musí být roven 90
                </Text>
              )}
              <Text className="mx-7 font-black">Poměr</Text>
              <Progress.Root className="mx-5" size="xl">
                {linksStore.links.map((e, index) => (
                  <Progress.Section
                    key={e.id}
                    color={colors[index + 1]}
                    value={e.share}
                  >
                    <Progress.Label>
                      {e.parent} | {e.currentlyAssigned || 0}/{e.share}
                    </Progress.Label>
                  </Progress.Section>
                ))}
                <Progress.Section color="pink" value={10}>
                  <Progress.Label>Vývojáři (Fixní)</Progress.Label>
                </Progress.Section>
              </Progress.Root>
              <div className="flex justify-between items-center mx-5">
                <div className="flex gap-2">
                  <Button
                    radius="xl"
                    rightSection={<IconPlus size={14} />}
                    size="md"
                    onClick={handleCreate}
                  >
                    Přidat
                  </Button>
                </div>
                <div>
                  <Text fw={900}>Vývojáři</Text>
                  <Text fw={500}>6 / 10</Text>
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Links;
