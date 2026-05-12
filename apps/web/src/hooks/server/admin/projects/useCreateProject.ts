"use client";

import { useState } from "react";

import { createProject, putProjectIntegrations, putProjectLinks } from "./api";

import { uploadImage } from "@/hooks/server/admin/uploads";

import type {
    CreateProjectPayload,
    PutProjectIntegrationsPayload,
    PutProjectLinksPayload,
} from "./types";

type CreateFullProjectPayload = {
    project: CreateProjectPayload;
    links: PutProjectLinksPayload;
    integrations: PutProjectIntegrationsPayload;
    imageFile: File | null;
};

type UseCreateProjectParams = {
    onSuccess?: () => void | Promise<void>;
};

export function useCreateProject({ onSuccess }: UseCreateProjectParams = {}) {
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    async function createFullProject(
        payload: CreateFullProjectPayload
    ): Promise<void> {
        try {
            setIsCreating(true);
            setCreateError(null);

            const imageURL = await getUploadedImageURL(payload.imageFile);

            const project = await createProject({
                ...payload.project,
                image_url: imageURL,
            });

            await putProjectLinks(project.id, payload.links);
            await putProjectIntegrations(project.id, payload.integrations);

            await onSuccess?.();
        } catch (err) {
            setCreateError(
                err instanceof Error ? err.message : "Failed to create project"
            );
        } finally {
            setIsCreating(false);
        }
    }

    return {
        createFullProject,
        isCreating,
        createError,
    };
}

async function getUploadedImageURL(file: File | null): Promise<string | null> {
    if (file === null) {
        return null;
    }

    const response = await uploadImage(file, "projects");
    return response.url;
}
