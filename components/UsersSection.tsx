import { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Select,
  Loader,
  Box,
  Text,
  MultiSelect,
  Checkbox,
  Button,
  Modal,
  Group,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { api } from "@/utils/api";
import useBotStore from "@/stores/bot";

interface PublicUser {
  id: string;
  clientLevel: number;
  reference: string;
  rating: number;
  academyLink: string;
  name: string;
  username: string;
  created_at: string;
}

const UsersSection = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [levels, setLevels] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const state = useBotStore();

  const fetchUsers = async () => {
    if (!state.bot?.id) return;

    setLoading(true);
    try {
      const res = await api.get(`bot/users/${state.bot.id}`, {
        params: {
          page,
          per_page: perPage,
          sort_by: sortBy,
          sort_order: sortOrder,
          levels,
        },
      });

      setUsers(res.data.items);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error("Chyba při načítání uživatelů:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);

      newSet.has(id) ? newSet.delete(id) : newSet.add(id);

      return newSet;
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.post("bot/users/delete", {
        user_ids: Array.from(selectedUsers),
      });
      toast.success("Uživatelé byli úspěšně smazáni ✅");
      setSelectedUsers(new Set());
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Chyba při mazání uživatelů", err);
      toast.error("Nepodařilo se smazat vybrané uživatele ❌");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, sortBy, sortOrder, levels]);

  return (
    <Box className="w-full mt-4">
      <Modal
        centered
        opened={isConfirmOpen}
        title="Potvrzení smazání"
        onClose={() => setIsConfirmOpen(false)}
      >
        <Text>
          Opravdu chceš smazat {selectedUsers.size} vybraných uživatelů?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setIsConfirmOpen(false)}>
            Zrušit
          </Button>
          <Button color="red" onClick={handleDeleteConfirmed}>
            Smazat
          </Button>
        </Group>
      </Modal>

      <Box className="flex justify-between items-center mb-2">
        <Text fw="bold">Uživatelé</Text>
        {selectedUsers.size > 0 && (
          <Button
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => setIsConfirmOpen(true)}
          >
            Smazat vybrané ({selectedUsers.size})
          </Button>
        )}
      </Box>

      <Box className="flex gap-4 mb-2 flex-wrap">
        <Select
          data={[
            { value: "created_at", label: "Datum vytvoření" },
            { value: "name", label: "Jméno" },
          ]}
          label="Řadit podle"
          value={sortBy}
          onChange={(val) => setSortBy(val as any)}
        />
        <Select
          data={[
            { value: "asc", label: "Vzestupně" },
            { value: "desc", label: "Sestupně" },
          ]}
          label="Směr"
          value={sortOrder}
          onChange={(val) => setSortOrder(val as any)}
        />
        <Select
          data={["10", "20", "50", "100"].map((v) => ({ value: v, label: v }))}
          label="Na stránku"
          value={perPage.toString()}
          onChange={(val) => setPerPage(Number(val))}
        />
        <MultiSelect
          className="w-64"
          data={[
            { label: "Nezastakováno", value: "0" },
            { label: "Zastakováno", value: "1" },
            { label: "Affiliate", value: "2" },
          ]}
          label="Level"
          value={levels}
          onChange={(e) => setLevels(e)}
        />
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <Table className="text-left">
          <thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={
                    users.length > 0 &&
                    users.every((u) => selectedUsers.has(u.id))
                  }
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setSelectedUsers(new Set(users.map((u) => u.id)));
                    } else {
                      setSelectedUsers(new Set());
                    }
                  }}
                />
              </Table.Th>
              <Table.Th>Jméno</Table.Th>
              <Table.Th>Uživatelské jméno</Table.Th>
              <Table.Th>Level</Table.Th>
              <Table.Th>Hodnocení</Table.Th>
              <Table.Th>Reference</Table.Th>
              <Table.Th>Vytvořeno</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedUsers.has(u.id)}
                    onChange={() => toggleUserSelection(u.id)}
                  />
                </Table.Td>
                <Table.Td>{u.name}</Table.Td>
                <Table.Td className="text-pink-500 font-bold">
                  <a
                    href={`https://t.me/${u.username}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {u.username}
                  </a>
                </Table.Td>
                <Table.Td>{u.clientLevel}</Table.Td>
                <Table.Td>{u.rating}</Table.Td>
                <Table.Td>{u.reference || "-"}</Table.Td>
                <Table.Td>
                  {dayjs(u.created_at).format("DD.MM. YYYY HH:mm")}
                </Table.Td>
              </Table.Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination
        mt="md"
        size="sm"
        total={totalPages}
        value={page}
        onChange={setPage}
      />
    </Box>
  );
};

export default UsersSection;
