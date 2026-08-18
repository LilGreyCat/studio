import type {
    Project,
    ProjectDetail,
    ProjectIntegrations,
    ProjectLinks,
} from "./types";

import { fetchJson } from "@/utils/fetchJson";

export function getProjects(): Promise<Project[]> {
    return fetchJson<Project[]>("/projects/");
}

export function getProjectById(
    id: number,
    signal?: AbortSignal
): Promise<ProjectDetail> {
    return fetchJson<ProjectDetail>(`/projects/${id}`, { signal });
}

export function getProjectLinks(
    id: number,
    signal?: AbortSignal
): Promise<ProjectLinks> {
    return fetchJson<ProjectLinks>(`/projects/${id}/links`, { signal });
}

export function getProjectIntegrations(
    id: number,
    signal?: AbortSignal
): Promise<ProjectIntegrations> {
    return fetchJson<ProjectIntegrations>(`/projects/${id}/integrations`, {
        signal,
    });
}
