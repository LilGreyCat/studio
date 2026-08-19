"use client";

import { useState } from "react";

import { uploadImage } from "@/hooks/server/admin/uploads";
import { updateFullProject } from "./api";

import type {
    PutProjectIntegrationsPayload,
    PutProjectLinksPayload,
    UpdateProjectPayload,
} from "./types";

type UpdateFullProjectPayload = {
    project: UpdateProjectPayload;
    links: PutProjectLinksPayload;
    integrations: PutProjectIntegrationsPayload;
    imageFile?: File | null;
};

type UseUpdateProjectParams = {
    onSuccess?: () => void | Promise<void>;
};

export function useUpdateProject({ onSuccess }: UseUpdateProjectParams = {}) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    async function handleUpdate(
        projectId: number,
        payload: UpdateFullProjectPayload
    ): Promise<void> {
        try {
            setIsUpdating(true);
            setUpdateError(null);

            const imageURL = await getUpdatedImageURL(
                payload.project.image_url,
                payload.imageFile ?? null
            );

            await updateFullProject(projectId, {
                project: { ...payload.project, image_url: imageURL },
                links: payload.links,
                integrations: payload.integrations,
            });

            await onSuccess?.();
        } catch (err) {
            setUpdateError(
                err instanceof Error ? err.message : "Failed to update project"
            );
        } finally {
            setIsUpdating(false);
        }
    }

    return {
        handleUpdate,
        isUpdating,
        updateError,
    };
}

async function getUpdatedImageURL(
    currentImageURL: string | null | undefined,
    file: File | null
): Promise<string | null | undefined> {
    if (file === null) {
        return currentImageURL;
    }

    const response = await uploadImage(file, "projects");
    return response.url;
}
