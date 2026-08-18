"use client";

import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";

import {
  deleteHardware,
  type HardwareItem,
  reorderHardware,
  updateHardware,
  useAdminHardware,
} from "@/hooks/server/admin/hardware";

import HardwareFormView from "./HardwareFormView";
import HardwareListItem from "./HardwareListItem";

type Props = {
  onBack: () => void;
};

type Mode = "list" | "create" | "edit";

export default function AdminHardwareView({ onBack }: Props) {
  const { items, isLoading, error, refresh } = useAdminHardware();
  const [mode, setMode] = useState<Mode>("list");
  const [selectedItem, setSelectedItem] = useState<HardwareItem | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function openCreate(): void {
    setSelectedItem(null);
    setMode("create");
  }

  function openEdit(item: HardwareItem): void {
    setSelectedItem(item);
    setMode("edit");
  }

  function closeForm(): void {
    setSelectedItem(null);
    setMode("list");
  }

  async function handleFormSuccess(): Promise<void> {
    await refresh();
    closeForm();
  }

  async function runAction(action: () => Promise<void>): Promise<void> {
    try {
      setIsBusy(true);
      setActionError(null);
      await action();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "L’action a échoué");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete(item: HardwareItem): Promise<void> {
    if (
      !window.confirm(
        `Supprimer « ${item.title} » ? Cette action est irréversible.`
      )
    ) {
      return;
    }
    await runAction(() => deleteHardware(item.id));
  }

  async function handleToggleVisibility(item: HardwareItem): Promise<void> {
    await runAction(async () => {
      await updateHardware(item.id, { is_visible: !item.is_visible });
    });
  }

  async function handleMove(index: number, direction: -1 | 1): Promise<void> {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    await runAction(async () => {
      await reorderHardware(reordered.map((item) => item.id));
    });
  }

  if (mode === "create") {
    return (
      <HardwareFormView
        mode="create"
        onCancel={closeForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (mode === "edit" && selectedItem) {
    return (
      <HardwareFormView
        mode="edit"
        item={selectedItem}
        onCancel={closeForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h4">Gestion du matériel</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={openCreate}>
            Ajouter un matériel
          </Button>
          <Button variant="outlined" onClick={onBack}>
            Retour
          </Button>
        </Stack>
      </Stack>

      {actionError && <Typography color="error">{actionError}</Typography>}

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : items.length === 0 ? (
        <Typography>Aucun matériel enregistré.</Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((item, index) => (
            <HardwareListItem
              key={item.id}
              item={item}
              index={index}
              itemCount={items.length}
              isBusy={isBusy}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
              onMove={handleMove}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
