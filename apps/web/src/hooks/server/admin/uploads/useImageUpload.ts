"use client";

import { useState } from "react";

import { uploadImage } from "./api";

type UploadFolder = "projects" | "artists" | "hardware";

type UseImageUploadParams = {
    folder: UploadFolder;
    onUploaded: (url: string) => void;
};

export function useImageUpload({ folder, onUploaded }: UseImageUploadParams) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setIsUploading(true);
            setUploadError(null);

            const response = await uploadImage(file, folder);

            onUploaded(response.url);
        } catch (err) {
            setUploadError(
                err instanceof Error ? err.message : "Failed to upload image"
            );
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    }

    return {
        isUploading,
        uploadError,
        handleFileChange,
    };
}
