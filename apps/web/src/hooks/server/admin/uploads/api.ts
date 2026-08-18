import { fetchJson } from "@/utils/fetchJson";

type UploadFolder = "projects" | "artists" | "hardware";

type UploadResponse = {
    url: string;
};

export function uploadImage(
    file: File,
    folder: UploadFolder
): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", folder);

    return fetchJson<UploadResponse>("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
    });
}
