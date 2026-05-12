"use client";

import { useState } from "react";

import {
    patchProjectIntegrations,
    patchProjectLinks,
    updateProject,
} from "./api";

import type {
    PutProjectIntegrationsPayload,
    PutProjectLinksPayload,
    UpdateProjectPayload,
} from "./types";

type UseUpdateProjectParams = {
    onSuccess?: () => void | Promise<void>;
};

type UpdateFullProjectPayload = {
    project: UpdateProjectPayload;
    links?: Partial<PutProjectLinksPayload>;
    integrations?: Partial<PutProjectIntegrationsPayload>;
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

            await updateProject(projectId, payload.project);

            if (payload.links) {
                await patchProjectLinks(projectId, payload.links);
            }

            if (payload.integrations) {
                await patchProjectIntegrations(projectId, payload.integrations);
            }

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
