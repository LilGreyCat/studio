import { fetchJson } from "@/utils/fetchJson";

import type {
    CreateProjectPayload,
    Project,
    ProjectIntegrations,
    ProjectLinks,
    PutProjectIntegrationsPayload,
    PutProjectLinksPayload,
} from "./types";

export function createProject(payload: CreateProjectPayload): Promise<Project> {
    return fetchJson<Project>("/admin/projects", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export function putProjectLinks(
    projectId: number,
    payload: PutProjectLinksPayload
): Promise<ProjectLinks> {
    return fetchJson<ProjectLinks>(`/admin/projects/${projectId}/links`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export function putProjectIntegrations(
    projectId: number,
    payload: PutProjectIntegrationsPayload
): Promise<ProjectIntegrations> {
    return fetchJson<ProjectIntegrations>(
        `/admin/projects/${projectId}/integrations`,
        {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(payload),
        }
    );
}

export function deleteProject(projectId: number): Promise<void> {
    return fetchJson<void>(`/admin/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
    });
}
