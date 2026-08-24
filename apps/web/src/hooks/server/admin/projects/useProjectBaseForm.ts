import { useCallback, useEffect, useMemo, useState } from "react";

import type { Project } from "@/hooks/server/projects/types";

type UseProjectBaseFormParams = {
    project?: Project;
};

export function useProjectBaseForm({ project }: UseProjectBaseFormParams) {
    const [name, setName] = useState(project?.name ?? "");
    const [imageURL, setImageURL] = useState(project?.image_url ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);

    const imagePreviewURL = useMemo(() => {
        if (imageFile === null) {
            return null;
        }

        return URL.createObjectURL(imageFile);
    }, [imageFile]);

    useEffect(() => {
        return () => {
            if (imagePreviewURL !== null) {
                URL.revokeObjectURL(imagePreviewURL);
            }
        };
    }, [imagePreviewURL]);

    const handleImageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const file = event.target.files?.[0] ?? null;
            setImageFile(file);

            event.target.value = "";
        },
        []
    );

    return {
        name,
        imageURL,
        imageFile,
        imagePreviewURL,
        isFeatured,
        setName,
        setImageURL,
        setImageFile,
        setIsFeatured,
        handleImageChange,
    };
}
