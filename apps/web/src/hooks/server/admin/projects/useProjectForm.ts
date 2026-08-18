"use client";

import { emptyToNull } from "@/utils/emptyToNull";

import {
    useCreateProject,
    useUpdateProject,
} from "@/hooks/server/admin/projects";
import type { Project } from "@/hooks/server/projects/types";

import { useProjectBaseForm } from "./useProjectBaseForm";
import { useProjectIntegrationsForm } from "./useProjectIntegrationsForm";
import { useProjectLinksForm } from "./useProjectLinksForm";

type UseProjectFormParams = {
    mode: "create" | "edit";
    project?: Project;
    onSuccess: () => void | Promise<void>;
};

export function useProjectForm({
    mode,
    project,
    onSuccess,
}: UseProjectFormParams) {
    const isEditMode = mode === "edit";
    const projectId = isEditMode ? (project?.id ?? null) : null;

    const base = useProjectBaseForm({ project });

    const links = useProjectLinksForm({
        projectId,
        enabled: isEditMode,
    });

    const integrations = useProjectIntegrationsForm({
        projectId,
        enabled: isEditMode,
    });

    const { createFullProject, isCreating, createError } = useCreateProject({
        onSuccess,
    });

    const { handleUpdate, isUpdating, updateError } = useUpdateProject({
        onSuccess,
    });

    const isSubmitting = isCreating || isUpdating;

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        if (isEditMode && project) {
            await handleUpdate(project.id, {
                project: {
                    name: base.name.trim(),
                    image_url: emptyToNull(base.imageURL),
                },
                links: links.getLinksPayload(),
                integrations: integrations.getIntegrationsPayload(),
                imageFile: base.imageFile,
            });

            return;
        }

        await createFullProject({
            project: {
                name: base.name.trim(),
                image_url: null,
            },
            links: links.getLinksPayload(),
            integrations: integrations.getIntegrationsPayload(),
            imageFile: base.imageFile,
        });
    }

    return {
        ...base,
        ...links,
        ...integrations,

        isSubmitting,
        createError,
        updateError,

        handleSubmit,
    };
}
