const iframeSrcPattern = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

export function normalizeEmbedURL(value: string | null): string | null {
    if (!value) return null;

    const trimmedValue = value.trim();
    const match = trimmedValue.match(iframeSrcPattern);
    const candidate = match ? (match[1] ?? match[2]) : trimmedValue;

    try {
        const url = new URL(candidate);
        return url.protocol === "http:" || url.protocol === "https:"
            ? url.toString()
            : null;
    } catch {
        return null;
    }
}
