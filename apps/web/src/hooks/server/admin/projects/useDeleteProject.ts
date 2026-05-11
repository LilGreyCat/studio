"use client";

import { useState } from "react";
import { deleteProject } from "./api";

type UseDeleteProjectParams = {
    onSuccess?: () => void | Promise<void>;
};

export function useDeleteProject({ onSuccess }: UseDeleteProjectParams = {}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    async function handleDelete(projectId: number): Promise<void> {
        const confirmed = window.confirm(
            "Supprimer ce projet ? Cette action est irréversible."
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            setDeleteError(null);

            await deleteProject(projectId);
            await onSuccess?.();
        } catch (err) {
            setDeleteError(
                err instanceof Error ? err.message : "Failed to delete project"
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        handleDelete,
        isDeleting,
        deleteError,
    };
}
