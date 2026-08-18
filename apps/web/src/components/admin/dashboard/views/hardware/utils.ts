import { resolveImageURL } from "@/utils/resolveImageURL";

export function slugifyHardwareTitle(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function resolveHardwareImageURL(path: string): string {
    return resolveImageURL(path);
}

export async function readImageDimensions(
    file: File
): Promise<{ width: number; height: number }> {
    const objectURL = URL.createObjectURL(file);
    try {
        const image = new window.Image();
        image.src = objectURL;
        await image.decode();
        if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
            throw new Error("Dimensions d’image invalides");
        }
        if (image.naturalWidth > 32767 || image.naturalHeight > 32767) {
            throw new Error(
                "L’image dépasse les dimensions maximales autorisées"
            );
        }
        return { width: image.naturalWidth, height: image.naturalHeight };
    } finally {
        URL.revokeObjectURL(objectURL);
    }
}
